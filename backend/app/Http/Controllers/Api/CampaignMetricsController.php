<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CampaignMetrics;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampaignMetricsController extends Controller
{
    public function byCampaign(Campaign $campaign): JsonResponse
    {
        $metrics = $campaign->metrics;
        if (!$metrics) {
            return response()->json(['message' => 'No metrics available for this campaign'], 404);
        }
        return response()->json($metrics);
    }

    public function update(Request $request, CampaignMetrics $campaignMetrics): JsonResponse
    {
        $validated = $request->validate([
            'ctr' => 'nullable|numeric|min:0|max:100',
            'precision' => 'nullable|numeric|min:0|max:1',
            'auc_roc' => 'nullable|numeric|min:0|max:1',
            'statistical_tests' => 'nullable|array',
        ]);

        $campaignMetrics->update($validated);
        return response()->json($campaignMetrics->fresh());
    }

    public function index(): JsonResponse
    {
        return response()->json(CampaignMetrics::with('campaign')->get());
    }
}
