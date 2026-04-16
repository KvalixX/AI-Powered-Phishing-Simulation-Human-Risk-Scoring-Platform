<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\Campaign;
use App\Models\BehavioralEvent;
use App\Models\RLPolicy;
use App\Models\UserRiskScore;
use Illuminate\Support\Facades\Log;

class RLAgentService
{
    /**
     * Get the best phishing action for a specific contact.
     */
    public function getPersonalizedAction(Contact $contact, Campaign $campaign): array
    {
        $state = $this->calculateState($contact);
        
        // Epsilon-Greedy Exploration (15% chance)
        if (rand(1, 100) <= 15) {
            return $this->getRandomAction($campaign);
        }

        // Action space
        $difficulties = ['facile', 'moyen', 'difficile', 'expert'];
        $attackTypes = ['credential_harvesting', 'spear_phishing', 'ceo_fraud', 'malware_delivery'];

        // Logic-based decision (Exploitation)
        $difficulty = $campaign->difficulty_level ?? 'moyen';
        $attackType = $campaign->attack_type ?? $attackTypes[array_rand($attackTypes)];

        if ($state['clicks'] > 0 && $state['click_rate'] > 0.4) {
             // User is struggling. Don't overwhelm them, keep it accessible.
             $difficulty = $state['risk_score'] > 70 ? 'facile' : 'moyen';
        } elseif ($state['reports'] > 0 && $state['report_rate'] > 0.6) {
             // User is vigilant. Escalate difficulty.
             $currentIndex = array_search($difficulty, $difficulties);
             $difficulty = $difficulties[min(3, $currentIndex + 1)];
        }

        // Store policy for this specific campaign iteration
        RLPolicy::updateOrCreate(
            [
                'campaign_id' => $campaign->id,
                'contact_id' => $contact->id
            ],
            [
                'campaign_params' => [
                    'difficulty' => $difficulty,
                    'attack_type' => $attackType,
                    'is_personalized' => true
                ],
                'state' => $state,
                'rewards' => 0 // Initial
            ]
        );

        return [
            'difficulty' => $difficulty,
            'attack_type' => $attackType
        ];
    }

    /**
     * Update the reward signal for a contact based on their interaction.
     */
    public function updateReward(int $contactId, int $campaignId, float $rewardIncrement): void
    {
        $policy = RLPolicy::where('contact_id', $contactId)
            ->where('campaign_id', $campaignId)
            ->first();

        if ($policy) {
            $policy->increment('rewards', $rewardIncrement);
            Log::info("RL Policy reward updated for contact {$contactId} in campaign {$campaignId}: +{$rewardIncrement}");
        }
    }

    /**
     * Calculate current behavioral state of the user.
     */
    private function calculateState(Contact $contact): array
    {
        $events = BehavioralEvent::where('contact_id', $contact->id)->get();
        $total = $events->count();
        $clicks = $events->where('event_type', 'click')->count();
        $reports = $events->where('event_type', 'report')->count();
        
        $riskScore = UserRiskScore::where('contact_id', $contact->id)->first();

        return [
            'total_interactions' => $total,
            'clicks' => $clicks,
            'reports' => $reports,
            'click_rate' => $total > 0 ? $clicks / $total : 0,
            'report_rate' => $total > 0 ? $reports / $total : 0,
            'risk_score' => $riskScore ? $riskScore->score : 50,
        ];
    }

    private function getRandomAction(Campaign $campaign): array
    {
         $difficulties = ['facile', 'moyen', 'difficile', 'expert'];
         $attackTypes = ['credential_harvesting', 'spear_phishing', 'ceo_fraud', 'malware_delivery'];

         return [
             'difficulty' => $difficulties[array_rand($difficulties)],
             'attack_type' => $attackTypes[array_rand($attackTypes)]
         ];
    }
}
