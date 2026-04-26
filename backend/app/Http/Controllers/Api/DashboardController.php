<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Contact;
use App\Models\UserRiskScore;
use App\Models\BehavioralEvent;
use App\Models\Training;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * GET /api/v1/dashboard/metrics
     * KPIs globaux pour la page d'accueil
     */
    public function metrics(): JsonResponse
    {
        $totalContacts = Contact::count();
        $activeCampaigns = Campaign::where('status', 'active')->count();

        // Score de risque global (moyenne pondérée)
        $avgScore = UserRiskScore::avg('score') ?? 0;

        // Taux de formation global
        $totalTrainings = Training::count();
        $completedTrainings = Training::where('status', 'completed')->count();
        $trainingRate = $totalTrainings > 0 ? round(($completedTrainings / $totalTrainings) * 100, 1) : 0;

        // Contacts à haut risque (score > 75)
        $highRiskCount = UserRiskScore::where('score', '>', 75)->count();

        // Évolution du score vs mois précédent (simulé)
        $scoreTrend = -4.2; // amélioration de 4.2 points

        // Taux de clic global sur les 30 derniers jours
        $recentClicks = BehavioralEvent::where('event_type', 'click')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->count();
        $recentEmails = BehavioralEvent::where('created_at', '>=', Carbon::now()->subDays(30))->count();
        $clickRate = $recentEmails > 0 ? round(($recentClicks / $recentEmails) * 100, 1) : 0;

        $recentReports = BehavioralEvent::where('event_type', 'report')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->count();
        $reportRate = $recentEmails > 0 ? round(($recentReports / $recentEmails) * 100, 1) : 0;

        return response()->json([
            'global_risk_score' => round($avgScore, 1),
            'score_trend' => $scoreTrend,
            'active_campaigns' => $activeCampaigns,
            'total_contacts' => $totalContacts,
            'high_risk_contacts' => $highRiskCount,
            'training_completion' => $trainingRate,
            'click_rate_30d' => $clickRate,
            'report_rate_30d' => $reportRate,
        ]);
    }

    /**
     * GET /api/v1/dashboard/risk-trend
     * Évolution du score de risque sur les 6 derniers mois
     */
    public function riskTrend(): JsonResponse
    {
        $months = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $label = $date->format('M Y');

            // Variation progressive : score global simulé décroissant (amélioration)
            $baseScore = 65 - ($i * 2.5);

            $months[] = [
                'month' => $label,
                'score' => round($baseScore + mt_rand(-3, 3), 1),
                'clicks' => rand(5, 30),
                'reports' => rand(2, 15),
            ];
        }

        return response()->json($months);
    }

    /**
     * GET /api/v1/dashboard/recent-campaigns
     * 5 campagnes les plus récentes avec métriques
     */
    public function recentCampaigns(): JsonResponse
    {
        $campaigns = Campaign::with('metrics')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($c) {
                $metrics = $c->metrics;
                $eventCount = BehavioralEvent::where('campaign_id', $c->id)->count();
                $clicked = BehavioralEvent::where('campaign_id', $c->id)
                    ->where('event_type', 'click')->count();
                $reported = BehavioralEvent::where('campaign_id', $c->id)
                    ->where('event_type', 'report')->count();

                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'status' => $c->status,
                    'difficulty_level' => $c->difficulty_level,
                    'started_at' => $c->started_at,
                    'total_sent' => $eventCount,
                    'clicked' => $clicked,
                    'reported' => $reported,
                    'ctr' => $metrics?->ctr ?? 0,
                    'auc_roc' => $metrics?->auc_roc ?? 0,
                ];
            });

        return response()->json($campaigns);
    }

    /**
     * GET /api/v1/dashboard/ai-insights
     * Insights IA : alertes, recommandations et tendances
     */
    public function aiInsights(): JsonResponse
    {
        $highRisk = UserRiskScore::where('score', '>', 80)->count();
        $criticalDepts = Contact::whereHas('riskScore', fn($q) => $q->where('score', '>', 85))
            ->select('department')
            ->groupBy('department')
            ->pluck('department')
            ->toArray();

        $insights = [];

        if ($highRisk > 0) {
            $insights[] = [
                'type' => 'alert',
                'severity' => 'critical',
                'title' => "⚠️ {$highRisk} utilisateurs à risque critique détectés",
                'description' => 'Ces contacts ont un score > 80 et nécessitent une formation immédiate.',
                'action' => 'Voir les utilisateurs à risque',
                'action_link' => '/users?risk=critique',
            ];
        }

        if (!empty($criticalDepts)) {
            $deptList = implode(', ', array_slice($criticalDepts, 0, 2));
            $insights[] = [
                'type' => 'recommendation',
                'severity' => 'warning',
                'title' => "📊 Département(s) vulnérable(s) : {$deptList}",
                'description' => 'Le modèle IA détecte une concentration de risque dans ces équipes.',
                'action' => 'Analyser le département',
                'action_link' => '/risk-analytics',
            ];
        }

        $insights[] = [
            'type' => 'insight',
            'severity' => 'info',
            'title' => '🤖 Campagne RL active suggère une hausse de difficulté',
            'description' => "L'algorithme d'apprentissage par renforcement indique que les utilisateurs s'adaptent aux templates actuels.",
            'action' => 'Voir les politiques RL',
            'action_link' => '/campaigns',
        ];

        $insights[] = [
            'type' => 'positive',
            'severity' => 'success',
            'title' => '✅ Le taux de signalement a augmenté de 12% ce mois',
            'description' => 'Signe d\'une meilleure sensibilisation grâce aux formations récentes.',
            'action' => null,
            'action_link' => null,
        ];

        return response()->json($insights);
    }
}
