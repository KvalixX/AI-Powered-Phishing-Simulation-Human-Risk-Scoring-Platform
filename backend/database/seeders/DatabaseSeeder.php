<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Contact;
use App\Models\Campaign;
use App\Models\UserRiskScore;
use App\Models\CampaignMetrics;
use App\Models\RLPolicy;
use App\Models\Department;
use App\Models\BehavioralEvent;
use App\Models\TrainingModule;
use App\Models\Training;
use App\Models\EmailTemplate;
use App\Models\Report;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. CLEAR TABLES
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \App\Models\Department::truncate();
        \App\Models\TrainingModule::truncate();
        \App\Models\EmailTemplate::truncate();
        \App\Models\Contact::truncate();
        \App\Models\UserRiskScore::truncate();
        \App\Models\Campaign::truncate();
        \App\Models\BehavioralEvent::truncate();
        \App\Models\CampaignMetrics::truncate();
        \App\Models\Training::truncate();
        \App\Models\Report::truncate();
        \App\Models\RLPolicy::truncate();
        \App\Models\User::where('email', '!=', 'admin@admin.com')->delete();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. CREATE ADMIN USERS
        $admin = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Directeur Sécurité KIRA', 
                'password' => Hash::make('password'),
                'organization' => 'KIRA',
                'department' => 'Direction',
                'position' => 'CISO'
            ]
        );

        // 3. CREATE DEPARTMENTS
        $depts = [
            ['name' => 'IT & Infrastructure', 'description' => 'Technical team handling systems and network.'],
            ['name' => 'Finance & Accounting', 'description' => 'Handles the company numbers, invoices and payroll.'],
            ['name' => 'Human Resources', 'description' => 'Recruitment, employee relations and benefits.'],
            ['name' => 'Marketing & Sales', 'description' => 'Customer outreach and revenue generation.'],
            ['name' => 'Legal & Compliance', 'description' => 'Legal framework and regulatory adherence.'],
            ['name' => 'Executive Office', 'description' => 'The leadership team (C-level).'],
        ];

        foreach($depts as $d) {
            Department::create($d);
        }

        // 4. CREATE TRAINING MODULES
        $modules = [
            [
                'title' => 'Phishing 101: Les bases', 
                'description' => 'Comprendre les mécanismes du phishing et comment identifier un email suspect.',
                'category' => 'Beginner', 'duration' => '15 mins', 'difficulty' => 'facile', 'icon' => 'Shield', 'is_ai_recommended' => false
            ],
            [
                'title' => 'Spear Phishing et Fraude au Président', 
                'description' => 'Analyse des techniques avancées d\'usurpation d\'identité ciblant les cadres.',
                'category' => 'Advanced', 'duration' => '30 mins', 'difficulty' => 'difficile', 'icon' => 'Target', 'is_ai_recommended' => true
            ],
            [
                'title' => 'Sécurité sur les réseaux sociaux', 
                'description' => 'Comment protéger ses informations personnelles sur LinkedIn et Facebook.',
                'category' => 'Intermediate', 'duration' => '20 mins', 'difficulty' => 'moyen', 'icon' => 'Globe', 'is_ai_recommended' => false
            ],
            [
                'title' => 'Signalement et Réaction', 
                'description' => 'Que faire quand on a cliqué sur un lien suspect ? La procédure de signalement.',
                'category' => 'Security', 'duration' => '10 mins', 'difficulty' => 'facile', 'icon' => 'Bell', 'is_ai_recommended' => true
            ],
        ];

        foreach($modules as $m) {
            TrainingModule::create($m);
        }

        // 5. CREATE EMAIL TEMPLATES
        $templates = [
            [
                'name' => 'Urgent: Retard de paiement facture #4492', 
                'subject' => 'URGENT: Avis de retard - Facture non payée',
                'category' => 'Finance', 'difficulty_level' => 'moyen',
                'content_html' => '<p>Bonjour,</p><p>Votre facture #4492 est désormais en retard de 3 jours. Merci de régulariser la situation immédiatement.</p>'
            ],
            [
                'name' => 'Mise à jour de sécurité Microsoft mandatory', 
                'subject' => 'Action requise : Mise à jour de sécurité importante pour votre compte',
                'category' => 'IT', 'difficulty_level' => 'difficile',
                'content_html' => '<p>Votre compte Microsoft nécessite une mise à jour de sécurité suite à une tentative de connexion suspecte.</p>'
            ],
            [
                'name' => 'Nouveau bonus de performance Q1', 
                'subject' => 'Consultation de votre grille de bonus Q1',
                'category' => 'HR', 'difficulty_level' => 'facile',
                'content_html' => '<p>Les grilles de bonus ont été mises à jour. Cliquez ici pour voir votre montant pour ce trimestre.</p>'
            ],
        ];

        foreach($templates as $t) {
            EmailTemplate::create($t);
        }

        // 6. CREATE CONTACTS, RISK SCORES, AND EVENTS
        $firstNames = ['Jean', 'Marie', 'Paul', 'Sophie', 'Luc', 'Emma', 'Pierre', 'Julie', 'Marc', 'Alice', 'Thomas', 'Laura', 'David', 'Claire', 'Nicolas', 'Antoine', 'Sarah', 'Mathieu', 'Elise', 'Kevin'];
        $lastNames = ['Dupont', 'Martin', 'Legrand', 'Garnier', 'Richard', 'Bernard', 'Petit', 'Robert', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier'];
        $departments = ['IT & Infrastructure', 'Finance & Accounting', 'Human Resources', 'Marketing & Sales', 'Legal & Compliance', 'Executive Office'];
        $positions = ['Lead', 'Junior', 'Manager', 'Directeur', 'Analyste', 'Assistant'];

        // Create 40-50 contacts for good analytics
        for ($i = 0; $i < 45; $i++) {
            $fn = $firstNames[array_rand($firstNames)];
            $ln = $lastNames[array_rand($lastNames)];
            $dept = $departments[array_rand($departments)];
            
            $contact = Contact::create([
                'first_name' => $fn,
                'last_name' => $ln,
                'email' => strtolower($fn[0] . '.' . $ln . $i . '@kira-demo.com'),
                'department' => $dept,
                'position' => $positions[array_rand($positions)],
                'language' => $i % 5 == 0 ? 'en' : 'fr',
                'training_history' => []
            ]);

            // User Risk Score Logic based on department
            $baseScore = rand(10, 60);
            if ($dept === 'IT & Infrastructure') $baseScore -= 15;
            if ($dept === 'Marketing & Sales') $baseScore += 15;
            if ($dept === 'Executive Office') $baseScore += 20;
            
            $scoreValue = max(5, min(98, $baseScore + rand(-10, 10)));
            $level = $scoreValue < 30 ? 'faible' : ($scoreValue < 60 ? 'moyen' : ($scoreValue < 85 ? 'élevé' : 'critique'));

            UserRiskScore::create([
                'contact_id' => $contact->id,
                'score' => $scoreValue,
                'level' => $level,
                'confidence' => mt_rand(75, 99) / 100,
                'features' => [
                    'impulsivity' => mt_rand(1, 10), 
                    'reporting_rate' => $dept === 'IT & Infrastructure' ? mt_rand(7, 10) : mt_rand(1, 6),
                    'temporal_profile' => ['morning_vulnerability' => rand(0, 1) > 0.5]
                ],
                'last_updated' => now()->subDays(rand(0, 15))
            ]);
        }

        // 7. CREATE CAMPAIGNS AND EVENTS LINKED
        $campaignsData = [
            ['name' => 'Campagne Q1 - Phishing de Masse Bank', 'status' => 'completed', 'difficulty' => 'facile', 'started' => now()->subMonths(3), 'ended' => now()->subMonths(3)->addDays(14)],
            ['name' => 'Spear Phishing Executives - Fraude au Président', 'status' => 'completed', 'difficulty' => 'expert', 'started' => now()->subMonths(1), 'ended' => now()->subMonths(1)->addDays(7)],
            ['name' => 'Alerte Patch de Sécurité IT', 'status' => 'active', 'difficulty' => 'moyen', 'started' => now()->subDays(3), 'ended' => null],
            ['name' => 'Test Login Office 365 Outlook', 'status' => 'active', 'difficulty' => 'difficile', 'started' => now()->subHours(12), 'ended' => null],
            ['name' => 'Annonce RSE Trimestrielle', 'status' => 'scheduled', 'difficulty' => 'facile', 'started' => now()->addDays(5), 'ended' => null],
        ];

        $allContacts = Contact::all();

        foreach ($campaignsData as $cData) {
            $campaign = Campaign::create([
                'user_id' => $admin->id,
                'name' => $cData['name'],
                'description' => 'Simulation context: ' . $cData['name'],
                'status' => $cData['status'],
                'difficulty_level' => $cData['difficulty'],
                'rl_enabled' => $cData['difficulty'] !== 'facile',
                'started_at' => $cData['started'],
                'ended_at' => $cData['ended']
            ]);

            if ($cData['status'] !== 'scheduled') {
                // Generate some events for this campaign
                $participantsCount = rand(15, 40);
                $participants = $allContacts->random($participantsCount);
                
                $totalClicks = 0;
                $totalReports = 0;

                foreach($participants as $p) {
                    $rand = mt_rand(0, 100);
                    $eventType = null;
                    
                    // Logic: IT people report more, Executive click more
                    $clickProb = 20;
                    if ($p->department === 'Executive Office') $clickProb = 45;
                    if ($p->department === 'IT & Infrastructure') $clickProb = 5;

                    if ($rand < $clickProb) {
                        $eventType = 'click';
                        $totalClicks++;
                        
                        // Sometime they also submit data
                        if (mt_rand(0, 100) < 40) {
                            BehavioralEvent::create([
                                'contact_id' => $p->id,
                                'campaign_id' => $campaign->id,
                                'event_type' => 'submission',
                                'reaction_time' => rand(10, 300),
                                'device' => rand(0, 1) > 0.5 ? 'Windows Desktop' : 'iPhone iOS',
                                'ip_address' => '192.168.1.' . rand(10, 255),
                                'event_timestamp' => Carbon::parse($campaign->started_at)->addMinutes(rand(10, 600))
                            ]);
                        }
                    } else if ($rand > 80) {
                        $eventType = 'report';
                        $totalReports++;
                    }

                    if ($eventType) {
                        BehavioralEvent::create([
                            'contact_id' => $p->id,
                            'campaign_id' => $campaign->id,
                            'event_type' => $eventType,
                            'reaction_time' => rand(5, 1000),
                            'device' => rand(0, 1) > 0.5 ? 'Android Phone' : 'MacBook Pro',
                            'ip_address' => '10.0.0.' . rand(1, 255),
                            'event_timestamp' => Carbon::parse($campaign->started_at)->addMinutes(rand(1, 600))
                        ]);
                    }
                }

                // Create Metrics
                CampaignMetrics::create([
                    'campaign_id' => $campaign->id,
                    'ctr' => ($participantsCount > 0) ? ($totalClicks / $participantsCount) * 100 : 0,
                    'precision' => mt_rand(85, 98) / 100,
                    'auc_roc' => mt_rand(75, 92) / 100,
                    'statistical_tests' => [
                        'significance' => true,
                        'p_value' => 0.02,
                        'reporting_rate' => ($participantsCount > 0) ? ($totalReports / $participantsCount) * 100 : 0
                    ]
                ]);

                // Create RL Policy if enabled
                if ($campaign->rl_enabled) {
                    RLPolicy::create([
                        'campaign_id' => $campaign->id,
                        'rewards' => mt_rand(-10, 30),
                        'campaign_params' => [
                            'difficulty_increment' => 0.05,
                            'best_tone' => 'authority'
                        ],
                        'state' => ['learning_step' => rand(1, 5)]
                    ]);
                }
            }
        }

        // 8. CREATE TRAININGS
        $highRiskContacts = Contact::whereHas('riskScore', function($q) {
            $q->where('score', '>', 70);
        })->get();

        foreach($highRiskContacts as $p) {
            $moduleId = TrainingModule::pluck('id')->random();
            Training::create([
                'contact_id' => $p->id,
                'training_module_id' => $moduleId,
                'status' => rand(0,1) > 0.3 ? 'completed' : 'in_progress',
                'assigned_at' => now()->subDays(10),
                'completed_at' => rand(0,1) > 0.5 ? now()->subDays(2) : null,
                'score' => rand(70, 100)
            ]);
        }

        // 9. CREATE REPORTS
        $reports = [
            ['title' => 'Executive Risk Summary Q1', 'type' => 'executive', 'date' => now()->subMonths(1), 'status' => 'ready'],
            ['title' => 'Technical Behavior Analysis March', 'type' => 'analytics', 'date' => now()->subDays(15), 'status' => 'ready'],
            ['title' => 'Training Impact Assessment', 'type' => 'training', 'date' => now()->subDays(5), 'status' => 'generating'],
        ];

        foreach($reports as $r) {
            Report::create([
                'title' => $r['title'],
                'type' => $r['type'],
                'date' => $r['date'],
                'status' => $r['status'],
                'author_id' => $admin->id,
                'size' => rand(500, 5000) . ' KB'
            ]);
        }
    }
}
