<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\UserRiskScoreController;
use App\Http\Controllers\Api\BehavioralEventController;
use App\Http\Controllers\Api\TrainingController;
use App\Http\Controllers\Api\RLPolicyController;
use App\Http\Controllers\Api\CampaignMetricsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TrainingModuleController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\EmailTemplateController;
use App\Http\Controllers\Api\DepartmentController;

/*
|--------------------------------------------------------------------------
| KIRA API Routes — v1
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api/v1 (configured in bootstrap/app.php)
|
*/

Route::prefix('v1')->group(function () {

    // ─── AUTHENTICATION ─────────────────────────────────────────────────────
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        Route::put('user', [AuthController::class, 'update']);

        // ─── CONTACTS ───────────────────────────────────────────────────────────
        Route::apiResource('contacts', ContactController::class);
        Route::get('contacts/{contact}/risk-score', [ContactController::class, 'riskScore']);
        Route::get('contacts/{contact}/behavioral-events', [BehavioralEventController::class, 'byContact']);
        Route::get('contacts/{contact}/trainings', [TrainingController::class, 'byContact']);

        // ─── CAMPAIGNS ──────────────────────────────────────────────────────────
        Route::apiResource('campaigns', CampaignController::class);
        Route::get('campaigns/{campaign}/metrics', [CampaignController::class, 'metrics']);
        Route::get('campaigns/{campaign}/rl-policy', [RLPolicyController::class, 'byCampaign']);
        Route::post('campaigns/{campaign}/pause', [CampaignController::class, 'pause']);
        Route::post('campaigns/{campaign}/resume', [CampaignController::class, 'resume']);

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

        // ─── NEW MODULES ────────────────────────────────────────────────────────
        Route::apiResource('training-modules', TrainingModuleController::class);
        Route::apiResource('reports', ReportController::class);
        Route::get('reports/{report}/download', [ReportController::class, 'download']);
        Route::apiResource('email-templates', EmailTemplateController::class);
        Route::apiResource('departments', DepartmentController::class);

    }); // End sanctum protected routes
});
