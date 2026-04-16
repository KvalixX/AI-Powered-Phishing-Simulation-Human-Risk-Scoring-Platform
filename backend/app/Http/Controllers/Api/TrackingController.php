<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PhishingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TrackingController extends Controller
{
    protected $phishingService;

    public function __construct(PhishingService $phishingService)
    {
        $this->phishingService = $phishingService;
    }

    /**
     * Handle email click tracking.
     */
    public function click(string $token, Request $request)
    {
        try {
            $sentEmail = $this->phishingService->logClick(
                $token,
                $request->ip(),
                $request->header('User-Agent')
            );

            // In a real app, we'd redirect to a landing page.
            // For now, we return a JSON response or a simple HTML message.
            return response()->json([
                'message' => 'Interaction enregistrée',
                'contact' => "{$sentEmail->contact->first_name} {$sentEmail->contact->last_name}",
                'campaign' => $sentEmail->campaign->name,
                'status' => 'PHISHED'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token invalide ou erreur serveur'], 404);
        }
    }

    /**
     * Handle email report tracking.
     */
    public function report(string $token)
    {
        try {
            $sentEmail = $this->phishingService->logReport($token);

            return response()->json([
                'message' => 'Signalement enregistré. Merci pour votre vigilance !',
                'contact' => "{$sentEmail->contact->first_name} {$sentEmail->contact->last_name}",
                'status' => 'SECURE'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token invalide'], 404);
        }
    }
}
