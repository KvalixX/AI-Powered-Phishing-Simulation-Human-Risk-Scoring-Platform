<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SimulationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $mailSubject;
    public string $mailContent;
    public string $mailFrom;

    /**
     * Create a new message instance.
     */
    public function __construct(string $subject, string $content, string $from = 'security@kira-simulation.com')
    {
        $this->mailSubject = $subject;
        $this->mailContent = $content;
        $this->mailFrom = $from;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: $this->mailFrom,
            subject: $this->mailSubject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlString: $this->mailContent,
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
}
