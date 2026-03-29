<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\EnquiryConfirmation;
use App\Mail\EnquiryReceived;
use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EnquiryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'service_type' => 'required|in:web-development,machine-integration,ai-pipelines,pcb-designing,app-development,rd-consultancy,general',
            'message' => 'required|string|min:10',
        ]);

        $validated['ip_address'] = $request->ip();

        $enquiry = Enquiry::create($validated);

        // Send email notification AFTER the response is sent (non-blocking)
        $this->sendAdminNotificationDeferred($enquiry);

        return response()->json([
            'success' => true,
            'message' => 'Enquiry submitted successfully. We will get back to you soon.',
            'data' => $enquiry,
        ], 201);
    }

    /**
     * Dispatch both emails to the queue (non-blocking).
     * Response returns instantly; emails are sent by the queue worker in the background.
     */
    private function sendAdminNotificationDeferred(Enquiry $enquiry): void
    {
        $adminEmail = config('mail.admin_notification_email', 'info@shuekitech.com');

        // 1. Confirmation to the enquiry submitter
        Mail::to($enquiry->email)->queue(new EnquiryConfirmation($enquiry));

        // 2. Notification to admin inbox
        Mail::to($adminEmail)->queue(new EnquiryReceived($enquiry));
    }
}
