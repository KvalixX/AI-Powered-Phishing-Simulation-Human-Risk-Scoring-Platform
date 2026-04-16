<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Contact;
use App\Models\Training;
use App\Models\UserRiskScore;
use App\Models\BehavioralEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * GET /api/v1/users
     * Liste des contacts (utilisateurs simulés) avec filtres
     */
    public function index(Request $request): JsonResponse
    {
        $query = Contact::with('riskScore');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('first_name', 'like', "%{$s}%")
                  ->orWhere('last_name',  'like', "%{$s}%")
                  ->orWhere('email',      'like', "%{$s}%");
            });
        }

        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }

        if ($request->filled('riskLevel')) {
            $level = $request->riskLevel;
            $query->whereHas('riskScore', fn($q) => $q->where('level', $level));
        }

        $contacts = $query->get()->map(function ($c) {
            return [
                'id'         => $c->id,
                'name'       => $c->first_name . ' ' . $c->last_name,
                'first_name' => $c->first_name,
                'last_name'  => $c->last_name,
                'email'      => $c->email,
                'department' => $c->department,
                'position'   => $c->position,
                'language'   => $c->language ?? 'fr',
                'risk_score' => $c->riskScore?->score ?? 0,
                'risk_level' => $c->riskScore?->level ?? 'faible',
                'confidence' => $c->riskScore?->confidence ?? 0,
            ];
        });

        return response()->json($contacts);
    }

    /**
     * GET /api/v1/users/{id}
     * Profil détaillé d'un contact
     */
    public function show(int $id): JsonResponse
    {
        $contact = Contact::with(['riskScore', 'trainings.trainingModule'])
            ->findOrFail($id);

        $totalEvents = BehavioralEvent::where('contact_id', $id)->count();
        $clicks      = BehavioralEvent::where('contact_id', $id)->where('event_type', 'click')->count();
        $reports     = BehavioralEvent::where('contact_id', $id)->where('event_type', 'report')->count();

        return response()->json([
            'id'              => $contact->id,
            'name'            => $contact->first_name . ' ' . $contact->last_name,
            'first_name'      => $contact->first_name,
            'last_name'       => $contact->last_name,
            'email'           => $contact->email,
            'department'      => $contact->department,
            'position'        => $contact->position,
            'language'        => $contact->language ?? 'fr',
            'risk_score'      => $contact->riskScore?->score ?? 0,
            'risk_level'      => $contact->riskScore?->level ?? 'faible',
            'risk_confidence' => $contact->riskScore?->confidence ?? 0,
            'risk_features'   => $contact->riskScore?->features ?? [],
            'trainings'       => $contact->trainings,
            'behavior_stats'  => [
                'total_events' => $totalEvents,
                'clicks'       => $clicks,
                'reports'      => $reports,
                'click_rate'   => $totalEvents > 0 ? round(($clicks / $totalEvents) * 100, 1) : 0,
                'report_rate'  => $totalEvents > 0 ? round(($reports / $totalEvents) * 100, 1) : 0,
            ],
        ]);
    }

    /**
     * GET /api/v1/users/{id}/risk-history
     * Historique du score de risque simulé sur 6 mois
     */
    public function riskHistory(int $id): JsonResponse
    {
        $contact   = Contact::with('riskScore')->findOrFail($id);
        $baseScore = $contact->riskScore?->score ?? 50;

        $history = [];
        for ($i = 5; $i >= 0; $i--) {
            $history[] = [
                'month' => now()->subMonths($i)->format('M Y'),
                'score' => max(5, min(99, $baseScore + mt_rand(-12, 12) - ($i * 1.5))),
            ];
        }

        return response()->json($history);
    }

    /**
     * GET /api/v1/users/{id}/campaigns
     * Campagnes auxquelles le contact a participé
     */
    public function campaigns(int $id): JsonResponse
    {
        $events = BehavioralEvent::with('campaign')
            ->where('contact_id', $id)
            ->select('campaign_id', \DB::raw('COUNT(*) as event_count'),
                \DB::raw('SUM(event_type = "click") as clicks'),
                \DB::raw('SUM(event_type = "report") as reports'))
            ->groupBy('campaign_id')
            ->get();

        return response()->json($events);
    }

    /**
     * POST /api/v1/users/{id}/training
     * Assigner une formation à un contact
     */
    public function assignTraining(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'moduleId' => 'required|integer|exists:training_modules,id',
        ]);

        $contact = Contact::findOrFail($id);

        $training = Training::create([
            'contact_id'         => $contact->id,
            'training_module_id' => $request->moduleId,
            'status'             => 'assigned',
            'assigned_at'        => now(),
        ]);

        // Update risk score slightly
        $riskScore = $contact->riskScore;
        if ($riskScore) {
            $riskScore->update([
                'score'        => max(0, $riskScore->score - 2),
                'last_updated' => now(),
            ]);
        }

        return response()->json([
            'message'  => 'Formation assignée avec succès.',
            'training' => $training,
        ], 201);
    }

    /**
     * POST /api/v1/users
     * Créer un nouveau contact
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'required|email|unique:contacts,email',
            'department' => 'nullable|string|max:100',
            'position'   => 'nullable|string|max:100',
            'language'   => 'nullable|string|max:10',
        ]);

        $contact = Contact::create($validated);

        // Create initial risk score
        UserRiskScore::create([
            'contact_id'   => $contact->id,
            'score'        => 30.0,
            'level'        => 'faible',
            'confidence'   => 0.5,
            'features'     => [],
            'last_updated' => now(),
        ]);

        return response()->json($contact->load('riskScore'), 201);
    }

    /**
     * PUT /api/v1/users/{id}
     * Mettre à jour un contact
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $contact = Contact::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name'  => 'sometimes|string|max:100',
            'email'      => 'sometimes|email|unique:contacts,email,' . $id,
            'department' => 'nullable|string|max:100',
            'position'   => 'nullable|string|max:100',
            'language'   => 'nullable|string|max:10',
        ]);

        $contact->update($validated);

        return response()->json($contact->fresh()->load('riskScore'));
    }

    /**
     * DELETE /api/v1/users/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json(['message' => 'Contact supprimé avec succès.']);
    }
}
