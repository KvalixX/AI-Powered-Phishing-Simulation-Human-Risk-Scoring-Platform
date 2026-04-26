<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignMetrics;
use App\Models\RLPolicy;
use App\Services\PhishingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    protected $phishingService;

    public function __construct(PhishingService $phishingService)
    {
        $this->phishingService = $phishingService;
    }

    public function index(): JsonResponse
    {
        $campaigns = Campaign::with(['metrics', 'rlPolicy', 'sentPhishingEmails'])
            ->where('user_id', auth()->id()) // Scope to the current user
            ->get();
        return response()->json($campaigns);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,active,completed,scheduled',
            'difficulty_level' => 'nullable|in:facile,moyen,difficile,expert',
            'adaptation_params' => 'nullable|array',
            'rl_enabled' => 'nullable|boolean',
            'target_departments' => 'nullable|array',
            'target_contacts' => 'nullable|array',
            'attack_type' => 'nullable|string',
            'started_at' => 'nullable|date',
            'ended_at' => 'nullable|date',
        ]);

        $validated['user_id'] = auth()->id();
        $campaign = Campaign::create($validated);


        // Auto-create initial metrics
        CampaignMetrics::create([
            'campaign_id' => $campaign->id,
            'ctr' => 0,
            'precision' => 0,
            'auc_roc' => 0,
        ]);

        // Pre-generate emails for preview
        app(\App\Services\PhishingService::class)->generateEmailsForCampaign($campaign);

        if ($campaign->rl_enabled) {
            RLPolicy::create([
                'campaign_id' => $campaign->id,
                'rewards' => 0,
                'campaign_params' => ['initial' => true],
                'state' => ['iteration' => 0]
            ]);
        }

        // Auto-launch if status is active
        if ($campaign->status === 'active') {
            $this->phishingService->generateEmailsForCampaign($campaign);
            $this->phishingService->sendCampaignEmails($campaign);
        } else {
            $this->phishingService->generateEmailsForCampaign($campaign);
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
            'status' => 'nullable|in:draft,active,completed,paused,scheduled',
            'difficulty_level' => 'nullable|in:facile,moyen,difficile,expert',
            'adaptation_params' => 'nullable|array',
            'rl_enabled' => 'nullable|boolean',
            'attack_type' => 'nullable|string',
            'target_departments' => 'nullable|array',
            'target_contacts' => 'nullable|array',
        ]);

        $campaign->update($validated);

        if (isset($validated['status']) && $validated['status'] === 'active' && $campaign->started_at === null) {
            $this->phishingService->sendCampaignEmails($campaign);
        } elseif ($campaign->status === 'draft') {
            $this->phishingService->generateEmailsForCampaign($campaign);
        }

        return response()->json($campaign->fresh()->load('metrics'));
    }

    public function launch(Campaign $campaign): JsonResponse
    {
        $this->phishingService->sendCampaignEmails($campaign);
        return response()->json(['message' => 'Campagne lancée avec succès', 'campaign' => $campaign->fresh()]);
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

    public function pause(Campaign $campaign): JsonResponse
    {
        $campaign->update(['status' => 'paused']);
        return response()->json(['message' => 'Campagne mise en pause', 'campaign' => $campaign]);
    }

    public function resume(Campaign $campaign): JsonResponse
    {
        $campaign->update(['status' => 'active']);
        return response()->json(['message' => 'Campagne reprise', 'campaign' => $campaign]);
    }
}
