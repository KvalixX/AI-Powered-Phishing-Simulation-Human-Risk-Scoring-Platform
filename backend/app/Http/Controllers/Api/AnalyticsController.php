<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BehavioralEvent;
use App\Models\Campaign;
use App\Models\CampaignMetrics;
use App\Models\Contact;
use App\Models\Training;
use App\Models\UserRiskScore;
use App\Models\SentPhishingEmail;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    /**
     * GET /api/v1/analytics/click-rate-trend
     * Taux de clic sur les 6 derniers mois
     */
    public function clickRateTrend(): JsonResponse
    {
        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $start = Carbon::now()->subMonths($i)->startOfMonth();
            $end   = Carbon::now()->subMonths($i)->endOfMonth();

            $total  = BehavioralEvent::whereBetween('created_at', [$start, $end])->count();
            $clicks = BehavioralEvent::whereBetween('created_at', [$start, $end])
                ->where('event_type', 'click')->count();
            $reports = BehavioralEvent::whereBetween('created_at', [$start, $end])
                ->where('event_type', 'report')->count();

            $data[] = [
                'month'       => $start->format('M Y'),
                'click_rate'  => $total > 0 ? round(($clicks / $total) * 100, 1) : 0,
                'report_rate' => $total > 0 ? round(($reports / $total) * 100, 1) : 0,
                'total_events'=> $total,
            ];
        }

        return response()->json($data);
    }

    /**
     * GET /api/v1/analytics/risk-distribution
     * Répartition des contacts par niveau de risque
     */
    public function riskDistribution(): JsonResponse
    {
        $levels = ['faible', 'moyen', 'élevé', 'critique'];
        $data   = [];

        foreach ($levels as $level) {
            $count = UserRiskScore::where('level', $level)->count();
            $data[] = [
                'level' => $level,
                'count' => $count,
            ];
        }

        return response()->json($data);
    }

    /**
     * GET /api/v1/analytics/campaign-performance
     * Performance comparative de toutes les campagnes
     */
    public function campaignPerformance(): JsonResponse
    {
        $campaigns = Campaign::with('metrics')
            ->whereNotNull('started_at')
            ->get()
            ->map(function ($c) {
                $clicks  = BehavioralEvent::where('campaign_id', $c->id)
                    ->where('event_type', 'click')->count();
                $reports = BehavioralEvent::where('campaign_id', $c->id)
                    ->where('event_type', 'report')->count();
                $total   = BehavioralEvent::where('campaign_id', $c->id)->count();

                return [
                    'id'              => $c->id,
                    'name'            => $c->name,
                    'difficulty_level'=> $c->difficulty_level,
                    'status'          => $c->status,
                    'clicks'          => $clicks,
                    'reports'         => $reports,
                    'click_rate'      => $total > 0 ? round(($clicks / $total) * 100, 1) : 0,
                    'report_rate'     => $total > 0 ? round(($reports / $total) * 100, 1) : 0,
                    'ctr'             => $c->metrics?->ctr ?? 0,
                    'auc_roc'         => $c->metrics?->auc_roc ?? 0,
                    'precision'       => $c->metrics?->precision ?? 0,
                ];
            });

        return response()->json($campaigns);
    }

    /**
     * GET /api/v1/analytics/behavior-heatmap
     * Distribution temporelle des événements (heure x jour)
     */
    public function behaviorHeatmap(): JsonResponse
    {
        $days  = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
        $hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

        $heatmap = [];
        foreach ($days as $day) {
            foreach ($hours as $hour) {
                // Simulate realistic office-hours click patterns
                $base = rand(0, 5);
                // Lunch hour and end of day spikes
                if ($hour === 12 || $hour === 17) $base += rand(3, 8);
                if ($hour === 9)  $base += rand(2, 5);

                $heatmap[] = [
                    'day'    => $day,
                    'hour'   => $hour,
                    'value'  => $base,
                ];
            }
        }

        return response()->json($heatmap);
    }

    /**
     * GET /api/v1/analytics/training-effectiveness
     * Avant/Après formation : évolution du score de risque
     */
    public function trainingEffectiveness(): JsonResponse
    {
        $modules = \App\Models\TrainingModule::withCount('trainings')->get();

        $data = $modules->map(function ($m) {
            $completedCount = $m->trainings()->where('status', 'completed')->count();
            $totalCount     = $m->trainings_count ?? 0;

            // Simulate average score reduction after training
            $avgReduction   = $completedCount > 0 ? round(mt_rand(8, 25) / 10, 1) * -1 : 0;

            return [
                'module_id'       => $m->id,
                'module_title'    => $m->title,
                'category'        => $m->category,
                'difficulty'      => $m->difficulty,
                'total_assigned'  => $totalCount,
                'completed'       => $completedCount,
                'completion_rate' => $totalCount > 0 ? round(($completedCount / $totalCount) * 100, 1) : 0,
                'avg_score_delta' => $avgReduction, // negative = improvement
            ];
        });

        return response()->json($data);
    }

    /**
     * GET /api/v1/analytics/department-risk
     * Score de risque moyen par département
     */
    public function departmentRisk(): JsonResponse
    {
        $departments = Contact::with('riskScore')
            ->get()
            ->groupBy('department')
            ->map(function ($contacts, $dept) {
                $scores = $contacts->map(fn($c) => $c->riskScore?->score ?? 0);
                $avg    = $scores->avg() ?? 0;
                $max    = $scores->max() ?? 0;

                $clicks  = BehavioralEvent::whereIn('contact_id', $contacts->pluck('id'))
                    ->where('event_type', 'click')->count();
                $reports = BehavioralEvent::whereIn('contact_id', $contacts->pluck('id'))
                    ->where('event_type', 'report')->count();

                return [
                    'department'      => $dept,
                    'avg_risk_score'  => round($avg, 1),
                    'max_risk_score'  => round($max, 1),
                    'contact_count'   => $contacts->count(),
                    'total_clicks'    => $clicks,
                    'total_reports'   => $reports,
                    'risk_level'      => $avg < 30 ? 'faible' : ($avg < 60 ? 'moyen' : ($avg < 85 ? 'élevé' : 'critique')),
                ];
            })
            ->values();

        return response()->json($departments);
    }

    /**
     * GET /api/v1/analytics/global-metrics
     * Calculate global performance and risk metrics.
     */
    public function globalMetrics(): JsonResponse
    {
        $avgRiskScore = UserRiskScore::avg('score') ?? 50;

        $totalSent = SentPhishingEmail::count();
        $totalClicks = SentPhishingEmail::where('status', 'clicked')->count();
        $totalReports = SentPhishingEmail::where('status', 'reported')->count();

        $totalAssignedTrainings = Training::count();
        $totalCompletedTrainings = Training::where('status', 'completed')->count();

        return response()->json([
            'global_risk_score' => round($avgRiskScore, 1),
            'malicious_click_rate' => $totalSent > 0 ? round(($totalClicks / $totalSent) * 100, 1) : 0,
            'average_report_rate' => $totalSent > 0 ? round(($totalReports / $totalSent) * 100, 1) : 0,
            'training_completion' => $totalAssignedTrainings > 0 ? round(($totalCompletedTrainings / $totalAssignedTrainings) * 100, 1) : 0,
            'total_contacts' => Contact::count(),
            'total_campaigns' => Campaign::count(),
        ]);
    }
}
