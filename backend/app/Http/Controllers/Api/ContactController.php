<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\UserRiskScore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(): JsonResponse
    {
        $contacts = Contact::with('riskScore')->get();
        return response()->json($contacts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:contacts',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'department' => 'nullable|string|max:100',
            'position' => 'nullable|string|max:100',
            'seniority' => 'nullable|string|max:50',
            'language' => 'nullable|string|max:10',
            'training_history' => 'nullable|array',
        ]);

        $contact = Contact::create($validated);

        // Initialize risk score at 0
        UserRiskScore::create([
            'contact_id' => $contact->id,
            'score' => 0,
            'level' => 'faible',
            'confidence' => 0,
            'last_updated' => now(),
        ]);

        return response()->json($contact->load('riskScore'), 201);
    }

    public function show(Contact $contact): JsonResponse
    {
        return response()->json($contact->load(['riskScore', 'trainings', 'behavioralEvents']));
    }

    public function update(Request $request, Contact $contact): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'sometimes|email|unique:contacts,email,' . $contact->id,
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'department' => 'nullable|string|max:100',
            'position' => 'nullable|string|max:100',
            'seniority' => 'nullable|string|max:50',
            'language' => 'nullable|string|max:10',
        ]);

        $contact->update($validated);
        return response()->json($contact);
    }

    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();
        return response()->json(['message' => 'Contact deleted successfully']);
    }

    public function riskScore(Contact $contact): JsonResponse
    {
        $score = $contact->riskScore ?? UserRiskScore::create([
            'contact_id' => $contact->id,
            'score' => 0,
            'level' => 'faible',
            'confidence' => 0,
            'last_updated' => now(),
        ]);

        return response()->json($score);
    }
}
