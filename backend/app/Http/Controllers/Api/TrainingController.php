<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Training;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainingController extends Controller
{
    public function index(): JsonResponse
    {
        $trainings = Training::with('contact')->get();
        return response()->json($trainings);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'contact_id' => 'required|exists:contacts,id',
            'training_module_id' => 'required|exists:training_modules,id',
            'status' => 'nullable|string|in:assigned,in_progress,completed',
            'ai_content' => 'nullable|string',
        ]);

        $training = Training::create($validated);
        return response()->json($training, 201);
    }

    public function show(Training $training): JsonResponse
    {
        return response()->json($training->load('contact'));
    }

    public function complete(Training $training): JsonResponse
    {
        $training->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
        return response()->json(['message' => 'Training marked as completed', 'training' => $training->fresh()]);
    }

    public function byContact(Contact $contact): JsonResponse
    {
        $trainings = $contact->trainings()->orderBy('created_at', 'desc')->get();
        return response()->json($trainings);
    }

    public function destroy(Training $training): JsonResponse
    {
        $training->delete();
        return response()->json(['message' => 'Training deleted']);
    }
}
