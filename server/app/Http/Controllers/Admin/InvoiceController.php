<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Carbon\Carbon;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with('customer')->withCount('items');

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->query('customer_id'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $invoices = $query->latest()->get();

        return response()->json(['invoices' => $invoices]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id'         => 'required|exists:customers,id',
            'payment_method_id'   => 'nullable|exists:payment_methods,id',
            'project_name'        => 'nullable|string|max:255',
            'status'              => 'nullable|in:draft,sent,paid',
            'issue_date'          => 'required|date',
            'due_date'            => 'nullable|date',
            'notes'               => 'nullable|string',
            'tax_percent'         => 'nullable|numeric|min:0|max:100',
            'items'               => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity'    => 'required|numeric|min:0.01',
            'items.*.unit_price'  => 'required|numeric|min:0',
        ]);

        [$subtotal, $taxAmount, $total] = $this->calcTotals(
            $request->input('items'),
            (float) $request->input('tax_percent', 0)
        );

        $invoice = Invoice::create([
            'invoice_number'    => $this->generateInvoiceNumber(),
            'customer_id'       => $request->input('customer_id'),
            'payment_method_id' => $request->input('payment_method_id') ?: null,
            'project_name'      => $request->input('project_name'),
            'status'            => $request->input('status', 'draft'),
            'issue_date'        => $request->input('issue_date'),
            'due_date'          => $request->input('due_date'),
            'notes'             => $request->input('notes'),
            'subtotal'          => $subtotal,
            'tax_percent'       => (float) $request->input('tax_percent', 0),
            'tax_amount'        => $taxAmount,
            'total'             => $total,
        ]);

        $this->saveItems($invoice->id, $request->input('items'));

        return response()->json([
            'invoice' => $invoice->load(['customer', 'items', 'paymentMethod']),
        ], 201);
    }

    public function show(Invoice $invoice)
    {
        return response()->json([
            'invoice' => $invoice->load(['customer', 'items', 'paymentMethod']),
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $request->validate([
            'customer_id'         => 'required|exists:customers,id',
            'payment_method_id'   => 'nullable|exists:payment_methods,id',
            'project_name'        => 'nullable|string|max:255',
            'status'              => 'nullable|in:draft,sent,paid',
            'issue_date'          => 'required|date',
            'due_date'            => 'nullable|date',
            'notes'               => 'nullable|string',
            'tax_percent'         => 'nullable|numeric|min:0|max:100',
            'items'               => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity'    => 'required|numeric|min:0.01',
            'items.*.unit_price'  => 'required|numeric|min:0',
        ]);

        $taxPercent = (float) $request->input('tax_percent', $invoice->tax_percent);
        [$subtotal, $taxAmount, $total] = $this->calcTotals($request->input('items'), $taxPercent);

        $invoice->update([
            'customer_id'       => $request->input('customer_id'),
            'payment_method_id' => $request->input('payment_method_id') ?: null,
            'project_name'      => $request->input('project_name'),
            'status'            => $request->input('status', $invoice->status),
            'issue_date'        => $request->input('issue_date'),
            'due_date'          => $request->input('due_date'),
            'notes'             => $request->input('notes'),
            'subtotal'          => $subtotal,
            'tax_percent'       => $taxPercent,
            'tax_amount'        => $taxAmount,
            'total'             => $total,
        ]);

        $invoice->items()->delete();
        $this->saveItems($invoice->id, $request->input('items'));

        return response()->json([
            'invoice' => $invoice->fresh()->load(['customer', 'items', 'paymentMethod']),
        ]);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted']);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function calcTotals(array $items, float $taxPercent): array
    {
        $subtotal = 0;
        foreach ($items as $item) {
            $subtotal += (float) $item['quantity'] * (float) $item['unit_price'];
        }
        $taxAmount = round($subtotal * $taxPercent / 100, 2);
        $total = round($subtotal + $taxAmount, 2);
        return [round($subtotal, 2), $taxAmount, $total];
    }

    private function saveItems(int $invoiceId, array $items): void
    {
        foreach ($items as $index => $item) {
            InvoiceItem::create([
                'invoice_id'  => $invoiceId,
                'description' => $item['description'],
                'quantity'    => (float) $item['quantity'],
                'unit_price'  => (float) $item['unit_price'],
                'amount'      => round((float) $item['quantity'] * (float) $item['unit_price'], 2),
                'sort_order'  => $index,
            ]);
        }
    }

    private function generateInvoiceNumber(): string
    {
        $year   = Carbon::now()->year;
        $prefix = "INV-{$year}-";

        $last = Invoice::where('invoice_number', 'like', "{$prefix}%")
            ->orderByDesc('invoice_number')
            ->value('invoice_number');

        $next = $last
            ? (int) substr($last, strlen($prefix)) + 1
            : 1;

        return $prefix . str_pad($next, 4, '0', STR_PAD_LEFT);
    }
}
