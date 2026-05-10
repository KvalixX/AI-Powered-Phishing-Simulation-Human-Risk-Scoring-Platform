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
        // Scope contacts to the authenticated user's organization
        // For demo purposes, if auth()->id() is null, fall back to 1.
        $userId = auth()->id();
        $contacts = Contact::with('riskScore')->where('user_id', $userId)->get();
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

        $validated['user_id'] = auth()->id();
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

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();
        $data = array_map('str_getcsv', file($path));
        // Remove header if present
        $header = array_shift($data);

        $userId = auth()->id();
        $importedCount = 0;

        foreach ($data as $row) {
            // Assume format: email, first_name, last_name, department, position
            if (count($row) >= 3) {
                $email = $row[0] ?? '';
                if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    // Check if already exists for this user
                    $exists = Contact::where('email', $email)->exists();
                    if (!$exists) {
                        $contact = Contact::create([
                            'user_id' => $userId,
                            'email' => $email,
                            'first_name' => $row[1] ?? 'Inconnu',
                            'last_name' => $row[2] ?? 'Inconnu',
                            'department' => $row[3] ?? null,
                            'position' => $row[4] ?? null,
                            'language' => 'fr',
                        ]);

                        UserRiskScore::create([
                            'contact_id' => $contact->id,
                            'score' => 0,
                            'level' => 'faible',
                            'confidence' => 0,
                            'last_updated' => now(),
                        ]);

                        $importedCount++;
                    }
                }
            }
        }

        return response()->json([
            'message' => "$importedCount contacts importés avec succès."
        ], 200);
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
