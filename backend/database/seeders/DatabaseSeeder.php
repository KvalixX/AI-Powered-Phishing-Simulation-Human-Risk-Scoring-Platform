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

        // 3. (DEPARTMENTS REMOVED FOR CLEAN SEED)

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

        // 6. (CONTACTS, CAMPAIGNS, TRAININGS & REPORTS REMOVED FOR CLEAN SEED)
    }
}
