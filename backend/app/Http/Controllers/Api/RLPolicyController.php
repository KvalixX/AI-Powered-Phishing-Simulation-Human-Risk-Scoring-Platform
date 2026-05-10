<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RLPolicy;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RLPolicyController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(RLPolicy::with('campaign')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'campaign_id' => [
                'required',
                \Illuminate\Validation\Rule::exists('campaigns', 'id')->where(fn ($q) => $q->where('user_id', auth()->id()))
            ],
            'campaign_params' => 'nullable|array',
            'rewards' => 'nullable|numeric',
            'state' => 'nullable|array',
        ]);

        $policy = RLPolicy::create($validated);
        return response()->json($policy, 201);
    }

    public function byCampaign(Campaign $campaign): JsonResponse
    {
        $policy = $campaign->rlPolicy;
        if (!$policy) {
            return response()->json(['message' => 'No RL policy for this campaign'], 404);
        }
        return response()->json($policy);
    }

    public function update(Request $request, RLPolicy $rlPolicy): JsonResponse
    {
        $validated = $request->validate([
            'campaign_params' => 'nullable|array',
            'rewards' => 'nullable|numeric',
            'state' => 'nullable|array',
        ]);

        $rlPolicy->update($validated);
        return response()->json($rlPolicy->fresh());
    }
}
