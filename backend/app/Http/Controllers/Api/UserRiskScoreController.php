<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserRiskScore;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserRiskScoreController extends Controller
{
    public function show(Contact $contact): JsonResponse
    {
        $score = $contact->riskScore;
        if (!$score) {
            return response()->json(['message' => 'No risk score computed yet for this contact'], 404);
        }
        return response()->json($score);
    }

    public function update(Request $request, UserRiskScore $riskScore): JsonResponse
    {
        $validated = $request->validate([
            'score' => 'required|numeric|min:0|max:100',
            'level' => 'required|in:faible,moyen,élevé,critique',
            'features' => 'nullable|array',
            'confidence' => 'nullable|numeric|min:0|max:1',
        ]);

        $validated['last_updated'] = now();
        $riskScore->update($validated);

        return response()->json($riskScore->fresh());
    }

    public function index(): JsonResponse
    {
        // Return all risk scores ordered by score descending (highest risk first)
        $scores = UserRiskScore::with('contact')
            ->orderBy('score', 'desc')
            ->get();

        return response()->json($scores);
    }
}
