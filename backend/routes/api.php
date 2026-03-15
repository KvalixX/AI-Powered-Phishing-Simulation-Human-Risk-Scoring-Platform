<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\UserRiskScoreController;
use App\Http\Controllers\Api\BehavioralEventController;
use App\Http\Controllers\Api\TrainingController;
use App\Http\Controllers\Api\RLPolicyController;
use App\Http\Controllers\Api\CampaignMetricsController;

/*
|--------------------------------------------------------------------------
| KIRA API Routes — v1
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api/v1 (configured in bootstrap/app.php)
|
*/

Route::prefix('v1')->group(function () {

    // ─── CONTACTS ───────────────────────────────────────────────────────────
    Route::apiResource('contacts', ContactController::class);
    Route::get('contacts/{contact}/risk-score', [ContactController::class, 'riskScore']);
    Route::get('contacts/{contact}/behavioral-events', [BehavioralEventController::class, 'byContact']);
    Route::get('contacts/{contact}/trainings', [TrainingController::class, 'byContact']);

    // ─── CAMPAIGNS ──────────────────────────────────────────────────────────
    Route::apiResource('campaigns', CampaignController::class);
    Route::get('campaigns/{campaign}/metrics', [CampaignController::class, 'metrics']);
    Route::get('campaigns/{campaign}/rl-policy', [RLPolicyController::class, 'byCampaign']);

    // ─── RISK SCORES ────────────────────────────────────────────────────────
    Route::get('risk-scores', [UserRiskScoreController::class, 'index']);
    Route::put('risk-scores/{riskScore}', [UserRiskScoreController::class, 'update']);

    // ─── BEHAVIORAL EVENTS ──────────────────────────────────────────────────
    Route::get('behavioral-events', [BehavioralEventController::class, 'index']);
    Route::post('behavioral-events', [BehavioralEventController::class, 'store']);

    // ─── TRAININGS ──────────────────────────────────────────────────────────
    Route::apiResource('trainings', TrainingController::class)->except(['update']);
    Route::put('trainings/{training}/complete', [TrainingController::class, 'complete']);

    // ─── RL POLICIES ────────────────────────────────────────────────────────
    Route::get('rl-policies', [RLPolicyController::class, 'index']);
    Route::post('rl-policies', [RLPolicyController::class, 'store']);
    Route::put('rl-policies/{rlPolicy}', [RLPolicyController::class, 'update']);

    // ─── CAMPAIGN METRICS ───────────────────────────────────────────────────
    Route::get('campaign-metrics', [CampaignMetricsController::class, 'index']);
    Route::put('campaign-metrics/{campaignMetrics}', [CampaignMetricsController::class, 'update']);

});
