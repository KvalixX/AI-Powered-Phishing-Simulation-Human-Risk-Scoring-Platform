<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Contact;
use App\Models\SentPhishingEmail;
use App\Models\BehavioralEvent;
use App\Models\Training;
use App\Models\TrainingModule;
use App\Models\EmailClick;
use App\Models\UserRiskScore;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\SimulationMail;
use App\Mail\TrainingMail;
use App\Services\RLAgentService;

class PhishingService
{
    private RLAgentService $rlAgent;

    public function __construct(RLAgentService $rlAgent)
    {
        $this->rlAgent = $rlAgent;
    }

    private array $attackTemplates = [
        'credential_harvesting' => [
            'label' => 'Credential Harvesting',
            'subject' => 'Action requise : vérifiez vos identifiants de connexion',
            'lure' => 'votre accès au portail va être suspendu si vous ne confirmez pas vos identifiants dans les prochaines 24 heures',
            'cta' => 'Vérifier mes identifiants',
            'sender' => 'sécurité@{company}-support.com',
        ],
        'spear_phishing' => [
            'label' => 'Spear Phishing Ciblé',
            'subject' => 'Message personnel de votre directeur {department}',
            'lure' => 'j\'ai besoin que vous examiniez ce document confidentiel avant la réunion de demain',
            'cta' => 'Ouvrir le document sécurisé',
            'sender' => 'direction@{company}-corp.fr',
        ],
        'ceo_fraud' => [
            'label' => 'Fraude au Président (BEC)',
            'subject' => 'CONFIDENTIEL – Demande urgente du PDG',
            'lure' => 'je suis en réunion stratégique et j\'ai besoin que vous effectuiez un virement discret avant 17h aujourd\'hui',
            'cta' => 'Accéder aux instructions sécurisées',
            'sender' => 'pdg@{company}-direction.com',
        ],
        'fake_invoice' => [
            'label' => 'Fausse Facture Fournisseur',
            'subject' => 'Facture #INV-{rand} en attente de validation',
            'lure' => 'une facture fournisseur est en attente de validation urgente dans votre espace comptabilité',
            'cta' => 'Valider la facture',
            'sender' => 'facturation@{company}-invoices.net',
        ],
        'it_password_reset' => [
            'label' => 'Réinitialisation Mot de Passe IT',
            'subject' => 'Votre mot de passe expire dans 2 heures',
            'lure' => 'votre mot de passe réseau expire aujourd\'hui. Veuillez le renouveler immédiatement',
            'cta' => 'Renouveler mon mot de passe',
            'sender' => 'it-support@{company}-helpdesk.com',
        ],
    ];

    /**
     * Generate and store personalized phishing emails for a campaign.
     */
    public function launchCampaign(Campaign $campaign)
    {
        // 1. Resolve target contacts
        $contacts = $this->resolveTargetContacts($campaign);

        foreach ($contacts as $contact) {
            $difficulty = $campaign->difficulty_level;
            $attackType = $campaign->attack_type;

            // 2. Resolve personalized parameters via RL if enabled
            if ($campaign->rl_enabled) {
                $personalized = $this->rlAgent->getPersonalizedAction($contact, $campaign);
                $difficulty = $personalized['difficulty'];
                $attackType = $personalized['attack_type'];
            }

            // 3. Generate content via Gemini
            $generated = $this->generateEmailContent($campaign, $contact, $difficulty, $attackType);

            // 3. Create tracking token
            $token = Str::random(40);

            // 4. Inject tracking URL into HTML
            $contentHtml = $this->injectTrackingUrl($generated['content_html'], $token);

            // 5. Store sent email record
            $sentRecord = SentPhishingEmail::create([
                'campaign_id' => $campaign->id,
                'contact_id' => $contact->id,
                'subject' => $generated['subject'],
                'content_html' => $contentHtml,
                'tracking_token' => $token,
                'status' => 'sent',
            ]);

            // 6. Send actual email via Gmail (SMTP)
            try {
                Mail::to($contact->email)->send(new SimulationMail(
                    $generated['subject'],
                    $contentHtml,
                    $this->getSenderEmail($campaign, $contact)
                ));
            } catch (\Exception $e) {
                Log::error("Failed to send simulation email to {$contact->email}: " . $e->getMessage());
            }
        }

        $campaign->update([
            'status' => 'active',
            'started_at' => now(),
        ]);
    }

    /**
     * Log a click and assign training.
     */
    public function logClick(string $token, string $ip = null, string $userAgent = null)
    {
        $sentEmail = SentPhishingEmail::where('tracking_token', $token)->firstOrFail();

        if ($sentEmail->status === 'sent') {
            $sentEmail->update([
                'status' => 'clicked',
                'clicked_at' => now(),
            ]);

            // Log event for analytics
            BehavioralEvent::create([
                'contact_id' => $sentEmail->contact_id,
                'campaign_id' => $sentEmail->campaign_id,
                'event_type' => 'click',
                'ip_address' => $ip,
                'device' => $userAgent,
                'event_timestamp' => now(),
            ]);

            EmailClick::create([
                 'contact_id' => $sentEmail->contact_id,
                 'campaign_id' => $sentEmail->campaign_id,
                 'ip_address' => $ip,
                 'user_agent' => $userAgent,
            ]);

            // Update user risk score (vulnerability increase)
            $this->updateUserRiskScore($sentEmail->contact_id, 'click');

            // Update RL Reward if enabled
            if ($sentEmail->campaign->rl_enabled) {
                $this->rlAgent->updateReward($sentEmail->contact_id, $sentEmail->campaign_id, 1.0);
            }

            // Assign Training
            $this->assignTraining($sentEmail);
        }

        return $sentEmail;
    }

    /**
     * Log a report.
     */
    public function logReport(string $token)
    {
        $sentEmail = SentPhishingEmail::where('tracking_token', $token)->firstOrFail();

        if ($sentEmail->status !== 'reported') {
            $sentEmail->update([
                'status' => 'reported',
                'reported_at' => now(),
            ]);

            BehavioralEvent::create([
                'contact_id' => $sentEmail->contact_id,
                'campaign_id' => $sentEmail->campaign_id,
                'event_type' => 'report',
                'event_timestamp' => now(),
            ]);

            // Update user risk score (vulnerability decrease / resilience increase)
            $this->updateUserRiskScore($sentEmail->contact_id, 'report');

            // Update RL Reward if enabled
            if ($sentEmail->campaign->rl_enabled) {
                $this->rlAgent->updateReward($sentEmail->contact_id, $sentEmail->campaign_id, -1.0);
            }
        }

        return $sentEmail;
    }

    private function resolveTargetContacts(Campaign $campaign)
    {
        $query = Contact::query();

        if ($campaign->target_contacts) {
            $query->whereIn('id', $campaign->target_contacts);
        }

        if ($campaign->target_departments) {
            $query->orWhereIn('department', $campaign->target_departments);
        }

        return $query->get();
    }

    public function generateEmailContent(Campaign $campaign, Contact $contact, string $difficulty = null, string $attackType = null)
    {
        $difficulty = $difficulty ?? $campaign->difficulty_level;
        $attackType = $attackType ?? $campaign->attack_type;

        $apiKey = env('GEMINI_API_KEY');
        if (empty($apiKey)) {
            // Fallback to basic template if no API key
            $tpl = $this->attackTemplates[$campaign->attack_type] ?? $this->attackTemplates['credential_harvesting'];
            return [
                'subject' => str_replace('{department}', $contact->department, $tpl['subject']),
                'content_html' => "<p>Bonjour {$contact->first_name}, {$tpl['lure']}.</p><a href='#'>{$tpl['cta']}</a>"
            ];
        }

        $attackConfig = $this->attackTemplates[$attackType] ?? null;
        $attackLabel = $attackConfig['label'] ?? $attackType;
        $attackDesc = $attackConfig['lure'] ?? 'Invente un scénario crédible.';

        $difficultyInstructions = match ($difficulty) {
            'facile' => "Sois très générique (ex: 'Cher client' ou 'Utilisateur'). Fais des fautes d'orthographe ou de grammaire évidentes. Utilise une urgence basique sans justification solide. Le design doit sembler basique, presque amateur.",
            'moyen' => "Apparence professionnelle mais avec quelques légères incohérences. Le ton est corporatif. Crée un prétexte standard.",
            'difficile' => "Très réaliste et ciblé (Spear Phishing). Utilise explicitement le prénom, département ({$contact->department}) et poste ({$contact->position}) de la cible. Le design HTML doit être soigné et imiter parfaitement une communication d'entreprise interne.",
            'expert' => "Indétectable, extrêmement sophistiqué et hautement manipulatoire. Imite une autorité ou un outil incontournable de l'entreprise. Utilise un design HTML impeccable et des déclencheurs psychologiques puissants (peur, obéissance). Aucune faute. Parle d'un dossier ou d'une procédure critique.",
            default => "Réaliste."
        };

        $prompt = "Tu es un expert en Red Teaming chargé de rédiger un email de phishing simulé (TEST AUTORISÉ) pour l'entraînement des employés. Tu dois générer un contenu ultra-réaliste.

CIBLE : {$contact->first_name} {$contact->last_name} | Poste : {$contact->position} | Département : {$contact->department} | Entreprise : " . ($contact->company ?? 'Entreprise') . "
TYPE D'ATTAQUE : {$attackLabel} - {$attackDesc}
NIVEAU DE DIFFICULTÉ : {$difficulty} -> DIRECTIVE : {$difficultyInstructions}

INSTRUCTIONS TECHNIQUES STRICTES :
1. Renvoie UNIQUEMENT un JSON valide contenant 'subject' (l'objet du mail) et 'content_html' (le corps du mail).
2. 'content_html' DOIT être du HTML sémantique, propre et stylisé avec du CSS inline (styles professionnels, couleurs de l'entreprise ou d'outils connus). Ne mets pas de Markdown autour.
3. Le lien ou bouton d'action principal (Call To Action) DOIT OBLIGATOIREMENT avoir l'attribut href=\"#\". Ne mets aucune autre URL, c'est indispensable pour notre système de tracking.
4. L'email doit être complet : salutations, corps persuasif, signature d'un expéditeur crédible, et footer éventuel.
5. Adapte parfaitement le niveau de langage et la subtilité à la difficulté demandée !

Exemple de format attendu :
{
  \"subject\": \"Action requise : ...\",
  \"content_html\": \"<div style='font-family: sans-serif;...'>Bonjour... <br><br> <a href='#' style='...'>Confirmer</a></div>\"
}";

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}";
        
        $maxRetries = 2;
        $attempt = 0;

        while ($attempt <= $maxRetries) {
            try {
                $response = Http::post($url, [
                    'contents' => [['parts' => [['text' => $prompt]]]],
                    'generationConfig' => ['responseMimeType' => 'application/json']
                ]);

                if ($response->successful()) {
                    $text = $response->json()['candidates'][0]['content']['parts'][0]['text'];
                    
                    // Clean up potential markdown codeblocks and whitespace
                    $text = preg_replace('/^```json\s*/', '', $text);
                    $text = preg_replace('/```$/', '', trim($text));

                    $parsed = json_decode($text, true);
                    if ($parsed && isset($parsed['subject']) && isset($parsed['content_html'])) {
                        return $parsed;
                    }
                } elseif ($response->status() === 429) {
                    // Rate limit exceeded (Too Many Requests). Wait and retry.
                    sleep(4);
                } else {
                    Log::error("Gemini API Error: " . $response->status() . " - " . $response->body());
                }
            } catch (\Exception $e) {
                Log::error("PhishingService Gemini Exception: " . $e->getMessage());
            }
            $attempt++;
        }

        return [
            'subject' => "Sécurité: Action requise",
            'content_html' => "<p>Veuillez vérifier votre compte.</p><a href='#'>Cliquez ici</a>"
        ];
    }

    private function injectTrackingUrl(string $html, string $token)
    {
        $trackingUrl = url("/api/v1/track/click/{$token}");
        $reportUrl = url("/api/v1/track/report/{$token}");

        // Replace all # or placeholder links with the tracking URL
        $html = str_replace(['href="#"', "href='#'"], "href='{$trackingUrl}'", $html);

        // Append a report link at the bottom
        $reportFooter = "
            <div style='margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-family: sans-serif;'>
                <p style='margin: 0; font-size: 12px; color: #6b7280;'>
                    Ce message vous semble suspect ? 
                    <a href='{$reportUrl}' style='color: #2563eb; text-decoration: underline; font-weight: 600;'>
                        Signaler ce phishing
                    </a>
                </p>
            </div>
        ";

        return $html . $reportFooter;
    }

    private function assignTraining(SentPhishingEmail $sentEmail)
    {
        $campaign = $sentEmail->campaign;
        $contact = $sentEmail->contact;
        
        // 1. Generate AI Training Content
        $aiContent = $this->generateTrainingArticle($campaign, $contact);

        // 2. Find matching module (optional, for categorization)
        $module = TrainingModule::where('category', 'LIKE', "%{$campaign->attack_type}%")
            ->orWhere('title', 'LIKE', "%{$campaign->attack_type}%")
            ->first() ?? TrainingModule::first();

        if ($module) {
            $training = Training::create([
                'contact_id' => $sentEmail->contact_id,
                'training_module_id' => $module->id,
                'status' => 'assigned',
                'assigned_at' => now(),
                'ai_content' => $aiContent,
            ]);

            // 3. Send the AI-generated training article immediately
            try {
                Mail::to($contact->email)->send(new TrainingMail($aiContent));
            } catch (\Exception $e) {
                Log::error("Failed to send training email to {$contact->email}: " . $e->getMessage());
            }
        }
    }

    private function generateTrainingArticle(Campaign $campaign, Contact $contact): string
    {
        $apiKey = env('GEMINI_API_KEY');
        if (empty($apiKey)) {
            return "<h2>Formation de Sécurité</h2><p>Vous avez cliqué sur un email de simulation. Rappelez-vous : vérifiez toujours l'expéditeur.</p>";
        }

        $prompt = "Génère un article de formation court et percutant pour un employé qui vient de cliquer sur un email de phishing simulé.
Type d'attaque : {$campaign->attack_type}
Employé : {$contact->first_name} ({$contact->position})
Consigne : Explique les indices qu'il a manqués dans cet email. Sois encourageant mais ferme sur la sécurité. Format HTML (uniquement le body, pas de head/html tags).";

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}";
            $response = Http::post($url, [
                'contents' => [['parts' => [['text' => $prompt]]]]
            ]);

            if ($response->successful()) {
                return $response->json()['candidates'][0]['content']['parts'][0]['text'];
            }
        } catch (\Exception $e) {
            Log::error("Training Article Gemini Error: " . $e->getMessage());
        }

        return "<p>Formation indisponible. Veuillez contacter le support IT.</p>";
    }

    private function getSenderEmail(Campaign $campaign, Contact $contact): string
    {
        $tpl = $this->attackTemplates[$campaign->attack_type] ?? $this->attackTemplates['credential_harvesting'];
        $sender = $tpl['sender'];
        
        $company = $contact->company ?? 'Entreprise';
        return str_replace(['{company}', '{department}', '{rand}'], [$company, $contact->department, rand(1000, 9999)], $sender);
    }

    private function updateUserRiskScore(int $contactId, string $action)
    {
        $scoreEntry = UserRiskScore::firstOrCreate(['contact_id' => $contactId], ['score' => 50, 'level' => 'moyen']);
        
        $newScore = $scoreEntry->score;
        if ($action === 'click') {
            $newScore = min(100, $newScore + 15);
        } elseif ($action === 'report') {
            $newScore = max(0, $newScore - 10);
        }

        $level = 'moyen';
        if ($newScore < 30) $level = 'faible';
        elseif ($newScore > 80) $level = 'critique';
        elseif ($newScore > 60) $level = 'élevé';

        $scoreEntry->update([
            'score' => $newScore,
            'level' => $level,
            'last_updated' => now(),
        ]);
    }
}
