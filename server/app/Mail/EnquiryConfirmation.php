<?php

namespace App\Mail;

use App\Models\Enquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnquiryConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public Enquiry $enquiry;
    public array $serviceLabels;

    public function __construct(Enquiry $enquiry)
    {
        $this->enquiry = $enquiry;
        $this->serviceLabels = EnquiryReceived::getServiceLabels();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'We received your enquiry — Shueki Tech',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.enquiry-confirmation',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
