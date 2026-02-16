<?php

namespace App\Mail;

use App\Models\Enquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnquiryReceived extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The enquiry instance.
     */
    public Enquiry $enquiry;

    /**
     * Service type labels for display.
     */
    public array $serviceLabels;

    /**
     * Create a new message instance.
     */
    public function __construct(Enquiry $enquiry)
    {
        $this->enquiry = $enquiry;
        $this->serviceLabels = self::getServiceLabels();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $serviceLabel = $this->serviceLabels[$this->enquiry->service_type] ?? $this->enquiry->service_type;

        return new Envelope(
            subject: "New Enquiry: {$serviceLabel} - {$this->enquiry->full_name}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.enquiry-received',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Map of service type slugs to human-readable labels.
     * Update this array if services change.
     */
    public static function getServiceLabels(): array
    {
        return [
            'web-development'     => 'Website Development',
            'machine-integration' => 'Machine Integration & Automation',
            'ai-pipelines'        => 'AI Pipelines',
            'pcb-designing'       => 'PCB Designing',
            'app-development'     => 'App Development',
            'rd-consultancy'      => 'R&D Consultancy',
            'general'             => 'General Enquiry',
        ];
    }
}
