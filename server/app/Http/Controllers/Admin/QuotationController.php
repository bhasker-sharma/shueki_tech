<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\QuotationSection;
use Illuminate\Http\Request;
use Carbon\Carbon;

class QuotationController extends Controller
{
    public function index(Request $request)
    {
        $query = Quotation::with('customer')->withCount('items');

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->query('customer_id'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        return response()->json(['quotations' => $query->latest()->get()]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id'          => 'required|exists:customers,id',
            'payment_method_id'    => 'nullable|exists:payment_methods,id',
            'title'                => 'required|string|max:255',
            'status'               => 'nullable|in:draft,sent,accepted,rejected,expired',
            'issue_date'           => 'required|date',
            'valid_until'          => 'nullable|date',
            'currency'             => 'nullable|string|max:3',
            'notes'                => 'nullable|string',
            'tax_percent'          => 'nullable|numeric|min:0|max:100',
            'items'                => 'nullable|array',
            'items.*.description'  => 'required_with:items|string',
            'items.*.quantity'     => 'required_with:items|numeric|min:0.01',
            'items.*.unit_price'   => 'required_with:items|numeric|min:0',
            'sections'             => 'nullable|array',
            'sections.*.type'      => 'required_with:sections|string',
            'sections.*.title'     => 'required_with:sections|string',
            'sections.*.content'   => 'nullable|string',
        ]);

        $taxPercent = (float) ($data['tax_percent'] ?? 0);
        $items      = $data['items'] ?? [];
        [$subtotal, $taxAmount, $total] = $this->calcTotals($items, $taxPercent);

        $quotation = Quotation::create([
            'quotation_number'  => $this->generateNumber(),
            'customer_id'       => $data['customer_id'],
            'payment_method_id' => $data['payment_method_id'] ?? null,
            'title'             => $data['title'],
            'status'            => $data['status'] ?? 'draft',
            'issue_date'        => $data['issue_date'],
            'valid_until'       => $data['valid_until'] ?? null,
            'currency'          => $data['currency'] ?? 'INR',
            'notes'             => $data['notes'] ?? null,
            'subtotal'          => $subtotal,
            'tax_percent'       => $taxPercent,
            'tax_amount'        => $taxAmount,
            'total'             => $total,
        ]);

        $this->saveItems($quotation->id, $items);
        $this->saveSections($quotation->id, $data['sections'] ?? []);

        return response()->json([
            'quotation' => $quotation->load(['customer', 'paymentMethod', 'items', 'sections']),
        ], 201);
    }

    public function show(Quotation $quotation)
    {
        return response()->json([
            'quotation' => $quotation->load(['customer', 'paymentMethod', 'items', 'sections']),
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        $data = $request->validate([
            'customer_id'          => 'required|exists:customers,id',
            'payment_method_id'    => 'nullable|exists:payment_methods,id',
            'title'                => 'required|string|max:255',
            'status'               => 'nullable|in:draft,sent,accepted,rejected,expired',
            'issue_date'           => 'required|date',
            'valid_until'          => 'nullable|date',
            'currency'             => 'nullable|string|max:3',
            'notes'                => 'nullable|string',
            'tax_percent'          => 'nullable|numeric|min:0|max:100',
            'items'                => 'nullable|array',
            'items.*.description'  => 'required_with:items|string',
            'items.*.quantity'     => 'required_with:items|numeric|min:0.01',
            'items.*.unit_price'   => 'required_with:items|numeric|min:0',
            'sections'             => 'nullable|array',
            'sections.*.type'      => 'required_with:sections|string',
            'sections.*.title'     => 'required_with:sections|string',
            'sections.*.content'   => 'nullable|string',
        ]);

        $taxPercent = (float) ($data['tax_percent'] ?? $quotation->tax_percent);
        $items      = $data['items'] ?? [];
        [$subtotal, $taxAmount, $total] = $this->calcTotals($items, $taxPercent);

        $quotation->update([
            'customer_id'       => $data['customer_id'],
            'payment_method_id' => $data['payment_method_id'] ?? null,
            'title'             => $data['title'],
            'status'            => $data['status'] ?? $quotation->status,
            'issue_date'        => $data['issue_date'],
            'valid_until'       => $data['valid_until'] ?? null,
            'currency'          => $data['currency'] ?? $quotation->currency,
            'notes'             => $data['notes'] ?? null,
            'subtotal'          => $subtotal,
            'tax_percent'       => $taxPercent,
            'tax_amount'        => $taxAmount,
            'total'             => $total,
        ]);

        $quotation->items()->delete();
        $quotation->sections()->delete();
        $this->saveItems($quotation->id, $items);
        $this->saveSections($quotation->id, $data['sections'] ?? []);

        return response()->json([
            'quotation' => $quotation->fresh()->load(['customer', 'paymentMethod', 'items', 'sections']),
        ]);
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();
        return response()->json(['message' => 'Quotation deleted']);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function calcTotals(array $items, float $taxPercent): array
    {
        $subtotal = 0;
        foreach ($items as $item) {
            $subtotal += (float) $item['quantity'] * (float) $item['unit_price'];
        }
        $taxAmount = round($subtotal * $taxPercent / 100, 2);
        return [round($subtotal, 2), $taxAmount, round($subtotal + $taxAmount, 2)];
    }

    private function saveItems(int $qId, array $items): void
    {
        foreach ($items as $i => $item) {
            QuotationItem::create([
                'quotation_id' => $qId,
                'description'  => $item['description'],
                'quantity'     => (float) $item['quantity'],
                'unit_price'   => (float) $item['unit_price'],
                'amount'       => round((float) $item['quantity'] * (float) $item['unit_price'], 2),
                'sort_order'   => $i,
            ]);
        }
    }

    private function saveSections(int $qId, array $sections): void
    {
        foreach ($sections as $i => $sec) {
            QuotationSection::create([
                'quotation_id' => $qId,
                'type'         => $sec['type'],
                'title'        => $sec['title'],
                'content'      => $sec['content'] ?? null,
                'sort_order'   => $i,
            ]);
        }
    }

    private function generateNumber(): string
    {
        $year   = Carbon::now()->year;
        $prefix = "QT-{$year}-";

        $last = Quotation::where('quotation_number', 'like', "{$prefix}%")
            ->orderByDesc('quotation_number')
            ->value('quotation_number');

        $next = $last ? (int) substr($last, strlen($prefix)) + 1 : 1;

        return $prefix . str_pad($next, 4, '0', STR_PAD_LEFT);
    }
}
