<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\EnquiryReceived;
use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
     * Send email notification after the HTTP response is sent to the user.
     * This makes the form submission instant - user doesn't wait for email delivery.
     */
    private function sendAdminNotificationDeferred(Enquiry $enquiry): void
    {
        $adminEmail = config('mail.admin_notification_email', env('ADMIN_EMAIL', 'admin@shuekitech.com'));

        app()->terminating(function () use ($enquiry, $adminEmail) {
            try {
                Mail::to($adminEmail)->send(new EnquiryReceived($enquiry));
            } catch (\Exception $e) {
                Log::error('Failed to send enquiry notification email: ' . $e->getMessage(), [
                    'enquiry_id' => $enquiry->id,
                    'admin_email' => $adminEmail,
                ]);
            }
        });
    }
}
