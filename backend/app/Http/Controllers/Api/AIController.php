<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\EmailTemplate;
use OpenAI\Laravel\Facades\OpenAI; // We'll install the laravel wrapper soon, or use the client directly. Wait, we installed openai-php/client. Let's use the pure PHP client.

class AIController extends Controller
{
    /**
     * Generate an email template tailored for a specific contact
     */
    public function generatePhishingEmail(Request $request)
    {
        $request->validate([
            'contact_id' => 'required|exists:contacts,id',
            'campaign_name' => 'nullable|string',
            'attack_type' => 'nullable|string',
            'context' => 'nullable|string', // E.g., 'URGENT payroll update', 'CEO message'
            'difficulty' => 'required|in:facile,moyen,difficile,expert'
        ]);

        $contact = Contact::findOrFail($request->contact_id);
        
        $apiKey = config('services.openai.key'); // We need to add this
        if (!$apiKey) {
           return response()->json(['error' => 'OpenAI API key not configured'], 500);
        }

        $client = \OpenAI::client($apiKey);
        
        $prompt = "Write a phishing email in French for an employee named {$contact->first_name} {$contact->last_name}. ";
        if ($contact->department) {
            $prompt .= "They work in the {$contact->department} department. ";
        }
        if ($contact->position) {
            $prompt .= "Their position is {$contact->position}. ";
        }
        
        $contextMap = [
            'facile' => 'Make it relatively obvious (typos, generic greetings).',
            'moyen' => 'Make it sound somewhat professional but with subtle red flags.',
            'difficile' => 'Make it highly sophisticated and targeted (Spear Phishing).',
            'expert' => 'Make it extremely convincing, impersonating an authority figure or critical internal system.'
        ];
        
        $prompt .= $contextMap[$request->difficulty] . " ";
        
        if ($request->context) {
            $prompt .= "The context of the email should be about: {$request->context}. ";
        }

        if ($request->campaign_name) {
            $prompt .= "The overall campaign theme is: '{$request->campaign_name}'. ";
        }

        if ($request->attack_type) {
            $prompt .= "CRITICAL: The email MUST follow this type of attack: '{$request->attack_type}'. Adapt the tone and the lure accordingly. ";
        }
        
        $prompt .= "Return the response in JSON format with two keys: 'subject' (the email subject) and 'content_html' (the HTML content of the email).";

        try {
            $response = $client->chat()->create([
                'model' => 'gpt-3.5-turbo', // Or gpt-4 if preferred
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a cybersecurity expert helping to generate realistic phishing simulations to train employees. Always output valid JSON.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
            ]);

            $jsonContent = $response->choices[0]->message->content;
            $data = json_decode($jsonContent, true);

            return response()->json([
                'subject' => $data['subject'] ?? 'Notification Importante',
                'content_html' => $data['content_html'] ?? '<p>Veuillez cliquer ici</p>',
                'generated' => true
            ]);
            
        } catch (\Exception $e) {
            // Provide a dynamic fallback even if API fails
            $subject = 'URGENT: ' . ($request->campaign_name ?? 'Action requise');
            $lure = $request->context ?? ($request->attack_type ? "contenant des informations sur " . $request->attack_type : "concernant votre compte");
            
            return response()->json([
                'subject' => $subject,
                'content_html' => "
                    <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;'>
                        <p>Bonjour {$contact->first_name},</p>
                        <p>Ceci est un message important concernant <strong>{$lure}</strong>.</p>
                        <p>Dans le cadre de notre stratégie " . ($request->attack_type ?? 'de sécurité') . ", une action immédiate est attendue.</p>
                        <p>Veuillez cliquer sur le bouton ci-dessous pour valider la procédure :</p>
                        <p style='margin: 20px 0;'>
                            <a href='#' style='background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Accéder au Portail Sécurisé</a>
                        </p>
                        <p>Cordialement,<br>L'équipe {$contact->department}</p>
                        <hr style='border: none; border-top: 1px solid #eee; margin-top: 20px;' />
                        <p style='font-size: 10px; color: #cc0000;'><strong>Note Technique :</strong> L'IA est en mode 'Simulation Premium' car votre quota OpenAI est dépassé ({$e->getMessage()}). Mais le système adapte quand même le contenu à vos réglages !</p>
                    </div>
                ",
                'generated' => false,
                'error' => 'Fallback: ' . $e->getMessage()
            ], 200);
        }
    }
}
