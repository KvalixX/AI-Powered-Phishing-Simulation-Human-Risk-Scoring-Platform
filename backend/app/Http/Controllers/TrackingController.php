<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BehavioralEvent;
use App\Models\Contact;
use App\Models\Campaign;

class TrackingController extends Controller
{
    /**
     * Traite les clics sur les liens de phishing.
     * Accessible publiquement sans authentification.
     */
    public function trackClick(Request $request, $campaignId, $contactId)
    {
        // Validation basique
        $campaign = Campaign::find($campaignId);
        $contact = Contact::find($contactId);

        if (!$campaign || !$contact) {
            abort(404);
        }

        // Enregistrer l'événement de clic
        BehavioralEvent::create([
            'contact_id' => $contact->id,
            'campaign_id' => $campaign->id,
            'event_type' => 'click',
            'reaction_time' => $campaign->started_at ? now()->diffInSeconds($campaign->started_at) : 0,
            'device' => $request->userAgent(),
            'ip_address' => $request->ip(),
            'event_timestamp' => now()
        ]);

        // Optionnel : Mettre à jour le score de risque direct ici
        if ($contact->riskScore) {
            $contact->riskScore->update([
                'score' => min(100, $contact->riskScore->score + 5), // Augmente le risque
                'level' => ($contact->riskScore->score > 80) ? 'critique' : 'élevé' // Simplification
            ]);
        }

        // Rediriger vers une page de sensibilisation ou une fausse page de login
        return view('phishing_alert', [
            'contact' => $contact,
            'campaign' => $campaign
        ]);
    }
}
