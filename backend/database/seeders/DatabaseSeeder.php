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
        $firstNames = ['Jean', 'Marie', 'Paul', 'Sophie', 'Luc', 'Emma', 'Pierre', 'Julie', 'Marc', 'Alice', 'Thomas', 'Laura', 'David', 'Claire', 'Nicolas', 'Antoine', 'Sarah', 'Mathieu', 'Elise', 'Kevin', 'Robert', 'Julien', 'Amélie', 'Christophe', 'Isabelle'];
        $lastNames = ['Dupont', 'Martin', 'Legrand', 'Garnier', 'Richard', 'Bernard', 'Petit', 'Robert', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'Andre', 'Mercier', 'Guillot'];
        $departments = ['IT & Infrastructure', 'Finance & Accounting', 'Human Resources', 'Marketing & Sales', 'Legal & Compliance', 'Executive Office'];
        $positions = ['Lead', 'Junior', 'Manager', 'Directeur', 'Analyste', 'Assistant'];

        // Create 50 contacts for good analytics
        for ($i = 0; $i < 50; $i++) {
            $fn = $firstNames[array_rand($firstNames)];
            $ln = $lastNames[array_rand($lastNames)];
            $dept = $departments[array_rand($departments)];
            
            $contact = Contact::create([
                'user_id' => $admin->id,
                'first_name' => $fn,
                'last_name' => $ln,
                'email' => strtolower($fn[0] . '.' . $ln . $i . '@kira-demo.com'),
                'department' => $dept,
                'position' => $positions[array_rand($positions)],
                'language' => $i % 7 == 0 ? 'en' : 'fr',
                'training_history' => []
            ]);

            // User Risk Score Logic based on department
            $baseScore = rand(20, 70);
            if ($dept === 'IT & Infrastructure') $baseScore -= 20;
            if ($dept === 'Marketing & Sales') $baseScore += 10;
            if ($dept === 'Executive Office') $baseScore += 25;
            
            $scoreValue = max(5, min(95, $baseScore + rand(-15, 15)));
            $level = $scoreValue < 30 ? 'faible' : ($scoreValue < 55 ? 'moyen' : ($scoreValue < 80 ? 'élevé' : 'critique'));

            UserRiskScore::create([
                'contact_id' => $contact->id,
                'score' => $scoreValue,
                'level' => $level,
                'confidence' => mt_rand(80, 99) / 100,
                'features' => [
                    'impulsivity' => mt_rand(1, 10), 
                    'reporting_rate' => $dept === 'IT & Infrastructure' ? mt_rand(7, 10) : mt_rand(1, 5),
                    'temporal_profile' => ['morning_vulnerability' => rand(0, 1) > 0.4]
                ],
                'last_updated' => now()->subDays(rand(0, 30))
            ]);
        }

        // 7. CREATE CAMPAIGNS AND EVENTS LINKED
        $campaignsData = [
            ['name' => 'Q1 Awareness: Credential Phish', 'status' => 'completed', 'difficulty' => 'facile', 'attack_type' => 'email', 'started' => now()->subMonths(3), 'ended' => now()->subMonths(3)->addDays(10)],
            ['name' => 'CEO Fraud - Urgent Wire Transfer', 'status' => 'completed', 'difficulty' => 'difficile', 'attack_type' => 'spear-phishing', 'started' => now()->subMonths(1), 'ended' => now()->subMonths(1)->addDays(5)],
            ['name' => 'Microsoft 365 Security Alert Simulation', 'status' => 'active', 'difficulty' => 'moyen', 'attack_type' => 'email', 'started' => now()->subDays(2), 'ended' => null],
            ['name' => 'HR Policy Update - Social Engineering', 'status' => 'active', 'difficulty' => 'difficile', 'attack_type' => 'social-engineering', 'started' => now()->subHours(6), 'ended' => null],
            ['name' => 'Upcoming: Password Policy Compliance', 'status' => 'scheduled', 'difficulty' => 'facile', 'attack_type' => 'email', 'started' => now()->addDays(3), 'ended' => null],
        ];

        $allContacts = Contact::all();

        foreach ($campaignsData as $cData) {
            $campaign = Campaign::create([
                'user_id' => $admin->id,
                'name' => $cData['name'],
                'description' => 'Simulated ' . $cData['attack_type'] . ' campaign with ' . $cData['difficulty'] . ' difficulty.',
                'status' => $cData['status'],
                'difficulty_level' => $cData['difficulty'],
                'attack_type' => $cData['attack_type'],
                'rl_enabled' => $cData['difficulty'] !== 'facile',
                'target_departments' => $cData['attack_type'] === 'spear-phishing' ? ['Executive Office', 'Finance & Accounting'] : ['IT & Infrastructure', 'Finance & Accounting', 'Human Resources', 'Marketing & Sales', 'Legal & Compliance', 'Executive Office'],
                'started_at' => $cData['started'],
                'ended_at' => $cData['ended']
            ]);

            if ($cData['status'] !== 'scheduled') {
                // Determine targeted contacts
                $targetedContacts = $allContacts->filter(function($c) use ($campaign) {
                    return in_array($c->department, $campaign->target_departments);
                });

                if ($targetedContacts->isEmpty()) $targetedContacts = $allContacts;
                
                $participantsCount = rand(floor($targetedContacts->count() * 0.6), $targetedContacts->count());
                $participants = $targetedContacts->random($participantsCount);
                
                $totalClicks = 0;
                $totalReports = 0;
                $totalSubmissions = 0;

                foreach($participants as $p) {
                    $rand = mt_rand(0, 100);
                    
                    // Logic: IT people report more, Executive/Sales click more
                    $clickProb = 15;
                    if ($p->department === 'Executive Office') $clickProb = 40;
                    if ($p->department === 'Marketing & Sales') $clickProb = 30;
                    if ($p->department === 'IT & Infrastructure') $clickProb = 3;
                    
                    // Increase probability for spear-phishing
                    if ($campaign->attack_type === 'spear-phishing') $clickProb += 15;

                    if ($rand < $clickProb) {
                        $totalClicks++;
                        
                        // Click event
                        BehavioralEvent::create([
                            'contact_id' => $p->id,
                            'campaign_id' => $campaign->id,
                            'event_type' => 'click',
                            'reaction_time' => rand(30, 1200),
                            'device' => rand(0, 1) > 0.4 ? 'Windows Desktop' : 'MacBook Pro',
                            'ip_address' => '10.50.1.' . rand(1, 254),
                            'event_timestamp' => Carbon::parse($campaign->started_at)->addMinutes(rand(10, 480))
                        ]);

                        // Sometime they also submit data (30-50% of clickers)
                        if (mt_rand(0, 100) < 45) {
                            $totalSubmissions++;
                            BehavioralEvent::create([
                                'contact_id' => $p->id,
                                'campaign_id' => $campaign->id,
                                'event_type' => 'submission',
                                'reaction_time' => rand(60, 300),
                                'device' => rand(0, 1) > 0.5 ? 'Chrome Browser' : 'Edge Browser',
                                'ip_address' => '10.50.1.' . rand(1, 254),
                                'event_timestamp' => Carbon::parse($campaign->started_at)->addMinutes(rand(11, 500))
                            ]);
                        }
                    } else if ($rand > 75) {
                        // People who don't click might report (especially IT)
                        $reportProb = 25;
                        if ($p->department === 'IT & Infrastructure') $reportProb = 60;
                        
                        if (mt_rand(0, 100) < $reportProb) {
                            $totalReports++;
                            BehavioralEvent::create([
                                'contact_id' => $p->id,
                                'campaign_id' => $campaign->id,
                                'event_type' => 'report',
                                'reaction_time' => rand(120, 3600),
                                'device' => 'Corporate Email Client',
                                'ip_address' => '10.50.1.' . rand(1, 254),
                                'event_timestamp' => Carbon::parse($campaign->started_at)->addMinutes(rand(20, 600))
                            ]);
                        }
                    }
                }

                // Create Metrics
                CampaignMetrics::create([
                    'campaign_id' => $campaign->id,
                    'ctr' => ($participantsCount > 0) ? ($totalClicks / $participantsCount) * 100 : 0,
                    'precision' => mt_rand(88, 99) / 100,
                    'auc_roc' => mt_rand(80, 95) / 100,
                    'statistical_tests' => [
                        'significance' => true,
                        'p_value' => mt_rand(1, 5) / 100,
                        'reporting_rate' => ($participantsCount > 0) ? ($totalReports / $participantsCount) * 100 : 0,
                        'submission_rate' => ($participantsCount > 0) ? ($totalSubmissions / $participantsCount) * 100 : 0
                    ]
                ]);

                // Create RL Policy if enabled
                if ($campaign->rl_enabled) {
                    RLPolicy::create([
                        'campaign_id' => $campaign->id,
                        'rewards' => mt_rand(-5, 40),
                        'campaign_params' => [
                            'difficulty_increment' => 0.08,
                            'best_tone' => $campaign->attack_type === 'spear-phishing' ? 'personal' : 'authority'
                        ],
                        'state' => ['learning_step' => rand(2, 8)]
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
