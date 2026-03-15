<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignMetrics;
use App\Models\RLPolicy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index(): JsonResponse
    {
        $campaigns = Campaign::with(['metrics', 'rlPolicy'])->get();
        return response()->json($campaigns);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,active,completed',
            'difficulty_level' => 'nullable|in:facile,moyen,difficile,expert',
            'adaptation_params' => 'nullable|array',
            'rl_enabled' => 'nullable|boolean',
            'started_at' => 'nullable|date',
            'ended_at' => 'nullable|date',
        ]);

        $validated['user_id'] = auth()->id() ?? 1; // Default to user 1 for now
        $campaign = Campaign::create($validated);

        // Auto-create metrics and RL policy records
        CampaignMetrics::create(['campaign_id' => $campaign->id]);
        if ($campaign->rl_enabled) {
            RLPolicy::create(['campaign_id' => $campaign->id, 'rewards' => 0]);
        }

        return response()->json($campaign->load(['metrics', 'rlPolicy']), 201);
    }

    public function show(Campaign $campaign): JsonResponse
    {
        return response()->json($campaign->load(['metrics', 'rlPolicy', 'behavioralEvents']));
    }

    public function update(Request $request, Campaign $campaign): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,active,completed',
            'difficulty_level' => 'nullable|in:facile,moyen,difficile,expert',
            'adaptation_params' => 'nullable|array',
            'rl_enabled' => 'nullable|boolean',
        ]);

        $campaign->update($validated);
        return response()->json($campaign->fresh()->load('metrics'));
    }

    public function destroy(Campaign $campaign): JsonResponse
    {
        $campaign->delete();
        return response()->json(['message' => 'Campaign deleted successfully']);
    }

    public function metrics(Campaign $campaign): JsonResponse
    {
        return response()->json($campaign->metrics ?? ['message' => 'No metrics yet']);
    }
}
