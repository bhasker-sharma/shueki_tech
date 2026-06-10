<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $methods = PaymentMethod::orderBy('sort_order')->orderBy('id')->get();
        return response()->json(['payment_methods' => $methods]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'label'      => 'required|string|max:255',
            'type'       => 'required|in:bank,upi,other',
            'details'    => 'required|string',
            'is_default' => 'nullable|boolean',
            'status'     => 'nullable|in:active,inactive',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->boolean('is_default')) {
            PaymentMethod::where('is_default', true)->update(['is_default' => false]);
        }

        $method = PaymentMethod::create([
            'label'      => $request->input('label'),
            'type'       => $request->input('type'),
            'details'    => $request->input('details'),
            'is_default' => $request->boolean('is_default', false),
            'status'     => $request->input('status', 'active'),
            'sort_order' => (int) $request->input('sort_order', 0),
        ]);

        return response()->json(['payment_method' => $method], 201);
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $request->validate([
            'label'      => 'required|string|max:255',
            'type'       => 'required|in:bank,upi,other',
            'details'    => 'required|string',
            'is_default' => 'nullable|boolean',
            'status'     => 'nullable|in:active,inactive',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->boolean('is_default')) {
            PaymentMethod::where('is_default', true)
                ->where('id', '!=', $paymentMethod->id)
                ->update(['is_default' => false]);
        }

        $paymentMethod->update([
            'label'      => $request->input('label'),
            'type'       => $request->input('type'),
            'details'    => $request->input('details'),
            'is_default' => $request->boolean('is_default', $paymentMethod->is_default),
            'status'     => $request->input('status', $paymentMethod->status),
            'sort_order' => (int) $request->input('sort_order', $paymentMethod->sort_order),
        ]);

        return response()->json(['payment_method' => $paymentMethod->fresh()]);
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        $paymentMethod->delete();
        return response()->json(['message' => 'Payment method deleted']);
    }
}
