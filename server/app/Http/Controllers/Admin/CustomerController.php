<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Enquiry;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::withCount(['invoices', 'enquiries'])
            ->orderBy('name')
            ->get();

        return response()->json(['customers' => $customers]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'nullable|email|max:255',
            'phone'      => 'nullable|string|max:30',
            'company'    => 'nullable|string|max:255',
            'address'    => 'nullable|string',
            'city'       => 'nullable|string|max:100',
            'gst_number' => 'nullable|string|max:30',
            'notes'      => 'nullable|string',
            'status'     => 'nullable|in:active,inactive',
        ]);

        $customer = Customer::create([
            'name'       => $request->input('name'),
            'email'      => $request->input('email'),
            'phone'      => $request->input('phone'),
            'company'    => $request->input('company'),
            'address'    => $request->input('address'),
            'city'       => $request->input('city'),
            'gst_number' => $request->input('gst_number'),
            'notes'      => $request->input('notes'),
            'status'     => $request->input('status', 'active'),
        ]);

        return response()->json([
            'customer' => $customer->loadCount(['invoices', 'enquiries']),
        ], 201);
    }

    public function show(Customer $customer)
    {
        $customer->load([
            'invoices' => fn ($q) => $q->latest()->limit(20),
            'enquiries' => fn ($q) => $q->latest()->limit(20),
        ]);
        $customer->loadCount(['invoices', 'enquiries']);

        return response()->json(['customer' => $customer]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'nullable|email|max:255',
            'phone'      => 'nullable|string|max:30',
            'company'    => 'nullable|string|max:255',
            'address'    => 'nullable|string',
            'city'       => 'nullable|string|max:100',
            'gst_number' => 'nullable|string|max:30',
            'notes'      => 'nullable|string',
            'status'     => 'nullable|in:active,inactive',
        ]);

        $customer->update([
            'name'       => $request->input('name'),
            'email'      => $request->input('email'),
            'phone'      => $request->input('phone'),
            'company'    => $request->input('company'),
            'address'    => $request->input('address'),
            'city'       => $request->input('city'),
            'gst_number' => $request->input('gst_number'),
            'notes'      => $request->input('notes'),
            'status'     => $request->input('status', $customer->status),
        ]);

        return response()->json([
            'customer' => $customer->fresh()->loadCount(['invoices', 'enquiries']),
        ]);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(['message' => 'Customer deleted']);
    }

    // Link an enquiry to this customer
    public function linkEnquiry(Customer $customer, $enquiryId)
    {
        $enquiry = Enquiry::findOrFail($enquiryId);
        $enquiry->update(['customer_id' => $customer->id]);
        return response()->json(['enquiry' => $enquiry->fresh()]);
    }

    // Unlink an enquiry from any customer
    public function unlinkEnquiry($enquiryId)
    {
        $enquiry = Enquiry::findOrFail($enquiryId);
        $enquiry->update(['customer_id' => null]);
        return response()->json(['enquiry' => $enquiry->fresh()]);
    }

    // Get enquiries not yet linked to any customer (for the link picker)
    public function unlinkedEnquiries()
    {
        $enquiries = Enquiry::whereNull('customer_id')
            ->orderByDesc('created_at')
            ->get(['id', 'full_name', 'email', 'company', 'service_type', 'created_at']);

        return response()->json(['enquiries' => $enquiries]);
    }
}
