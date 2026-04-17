<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$apiKey = env('GEMINI_API_KEY');

$prompt = "Tu es un expert en Red Teaming chargé de rédiger un email de phishing simulé (TEST AUTORISÉ) pour l'entraînement des employés. Tu dois générer un contenu ultra-réaliste.

CIBLE : Test User | Poste : Employee | Département : IT | Entreprise : Acme Corp
TYPE D'ATTAQUE : Phishing - Test
NIVEAU DE DIFFICULTÉ : expert -> DIRECTIVE : Test directive

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

try {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}";
    $response = Illuminate\Support\Facades\Http::post($url, [
        'contents' => [['parts' => [['text' => $prompt]]]],
        'generationConfig' => ['responseMimeType' => 'application/json']
    ]);

    echo "HTTP Status: " . $response->status() . "\n";
    
    if ($response->successful()) {
        $text = $response->json()['candidates'][0]['content']['parts'][0]['text'];
        echo "RAW TEXT:\n" . $text . "\n\n";

        $textClean = preg_replace('/^```json\s*/', '', $text);
        $textClean = preg_replace('/```$/', '', trim($textClean));
        
        echo "CLEANED TEXT:\n" . $textClean . "\n\n";
        
        $parsed = json_decode($textClean, true);
        echo "JSON ERROR: " . json_last_error_msg() . "\n";
        var_dump($parsed);
    } else {
        echo "ERROR BODY:\n" . $response->body() . "\n";
    }
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}


