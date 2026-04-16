<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Services\PhishingService;
use Illuminate\Http\JsonResponse;

class AIController extends Controller
{
    protected $phishingService;

    public function __construct(PhishingService $phishingService)
    {
        $this->phishingService = $phishingService;
    }

    /**
     * Generate a real phishing email using Gemini.
     */
    public function generatePhishingEmail(Request $request): JsonResponse
    {
        set_time_limit(300);

        $request->validate([
            'contact_id' => 'required|exists:contacts,id',
            'attack_type' => 'nullable|string',
            'difficulty' => 'required|in:facile,moyen,difficile,expert',
        ]);

        $contact = Contact::findOrFail($request->contact_id);
        
        // Simulate a campaign object for the service
        $campaign = new \App\Models\Campaign([
            'attack_type' => $request->attack_type ?? 'credential_harvesting',
            'difficulty_level' => $request->difficulty
        ]);

        $generated = $this->phishingService->generateEmailContent($campaign, $contact);

        return response()->json([
            'subject' => $generated['subject'],
            'content_html' => $generated['content_html'],
            'generated' => true,
            'attack_type' => $request->attack_type ?? 'Personnalisé',
            'mode' => 'gemini_api'
        ]);
    }
}
