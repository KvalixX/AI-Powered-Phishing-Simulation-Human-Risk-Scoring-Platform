<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;
use App\Models\Campaign;
use App\Models\UserRiskScore;
use App\Models\CampaignMetrics;
use App\Models\RLPolicy;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Contacts
        $contactsData = [
            ['first_name' => 'Jean', 'last_name' => 'Dupont', 'email' => 'j.dupont@entreprise.fr', 'department' => 'IT', 'position' => 'Développeur', 'language' => 'fr'],
            ['first_name' => 'Marie', 'last_name' => 'Martin', 'email' => 'm.martin@entreprise.fr', 'department' => 'Finance', 'position' => 'Comptable', 'language' => 'fr'],
            ['first_name' => 'Paul', 'last_name' => 'Legrand', 'email' => 'p.legrand@entreprise.fr', 'department' => 'Marketing', 'position' => 'Directeur', 'language' => 'en'],
            ['first_name' => 'Sophie', 'last_name' => 'Garnier', 'email' => 's.garnier@entreprise.fr', 'department' => 'RH', 'position' => 'Recruteuse', 'language' => 'fr'],
            ['first_name' => 'Luc', 'last_name' => 'Richard', 'email' => 'l.richard@entreprise.fr', 'department' => 'Ventes', 'position' => 'Commercial', 'language' => 'fr'],
        ];

        foreach ($contactsData as $data) {
            $contact = Contact::create($data);

            // Random Risk Score for each contact
            $scoreValue = rand(10, 95);
            $level = $scoreValue < 30 ? 'faible' : ($scoreValue < 60 ? 'moyen' : ($scoreValue < 85 ? 'élevé' : 'critique'));

            UserRiskScore::create([
                'contact_id' => $contact->id,
                'score' => $scoreValue,
                'level' => $level,
                'confidence' => mt_rand(50, 99) / 100,
                'features' => ['impulsivity' => mt_rand(1, 10), 'tech_savviness' => mt_rand(1, 10)],
                'last_updated' => now()
            ]);
        }

        // 2. Create Campaigns
        $campaignsData = [
            ['name' => 'Campagne Q2 - Email CEO Fraud (Backend)', 'description' => 'Simulate CEO urgent wire transfer', 'difficulty_level' => 'expert', 'status' => 'active', 'rl_enabled' => true, 'started_at' => now()->subDays(5)],
            ['name' => 'Fausse Facture RH (Backend)', 'description' => 'Fake invoice from HR', 'difficulty_level' => 'moyen', 'status' => 'completed', 'rl_enabled' => false, 'started_at' => now()->subDays(30), 'ended_at' => now()->subDays(25)],
            ['name' => 'Test Login Microsoft 365 (Backend)', 'description' => 'Credential harvesting via fake M365 portal', 'difficulty_level' => 'difficile', 'status' => 'active', 'rl_enabled' => true, 'started_at' => now()->subDays(1)],
            ['name' => 'Alerte Sécurité IT (Backend)', 'description' => 'Password expiry warning', 'difficulty_level' => 'facile', 'status' => 'scheduled', 'rl_enabled' => false],
            ['name' => 'Mise à jour Zoom Requise (Backend)', 'description' => 'Fake Zoom client update payload', 'difficulty_level' => 'moyen', 'status' => 'completed', 'rl_enabled' => true, 'started_at' => now()->subDays(60), 'ended_at' => now()->subDays(55)],
        ];

        // Assuming user ID 1 exists, since we hardcoded user_id=1 in CampaignController.
        // Let's create user 1 just in case
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            ['name' => 'Admin', 'password' => bcrypt('password')]
        );

        foreach ($campaignsData as $data) {
            $data['user_id'] = 1;
            $campaign = Campaign::create($data);

            // Metrics
            $sent = rand(50, 500);
            $clicked = rand(5, $sent / 2);
            $ctr = ($clicked / $sent) * 100;

            CampaignMetrics::create([
                'campaign_id' => $campaign->id,
                'ctr' => $ctr,
                'precision' => mt_rand(70, 95) / 100,
                'auc_roc' => mt_rand(70, 95) / 100,
                'statistical_tests' => ['p_value' => 0.04, 't_test' => 2.15]
            ]);

            // RL Policy if enabled
            if ($campaign->rl_enabled) {
                RLPolicy::create([
                    'campaign_id' => $campaign->id,
                    'rewards' => mt_rand(10, 50) / 10,
                    'campaign_params' => ['ton' => 'urgent', 'urgency_level' => 8, 'complexity' => 7],
                    'state' => ['iteration' => rand(1, 10)]
                ]);
            }
        }
    }
}
