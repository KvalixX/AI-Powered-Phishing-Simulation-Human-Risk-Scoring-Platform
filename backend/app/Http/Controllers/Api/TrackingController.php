<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Training;
use App\Services\PhishingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

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

    /**
     * 1×1 tracking pixel: marks the training email as opened (images must be allowed in the client).
     */
    public function openTrainingEmail(Training $training): Response
    {
        if ($training->email_opened_at === null) {
            $training->email_opened_at = now();
            if ($training->status === 'assigned') {
                $training->status = 'in_progress';
            }
            $training->save();
        }

        $pixel = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

        return response($pixel, 200, [
            'Content-Type' => 'image/gif',
            'Content-Length' => (string) strlen($pixel),
            'Cache-Control' => 'no-store, private',
        ]);
    }

    /**
     * Mark training as completed from email link.
     */
    public function completeTraining(Training $training)
    {
        $now = now();
        $training->update([
            'status' => 'completed',
            'completed_at' => $now,
            'email_opened_at' => $training->email_opened_at ?? $now,
        ]);

        return response()->json([
            'message' => 'Merci d\'avoir complété votre formation de sensibilisation.',
            'status' => 'COMPLETED'
        ]);
    }
}
