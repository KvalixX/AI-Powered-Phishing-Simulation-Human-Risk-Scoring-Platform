<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrainingModule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainingModuleController extends Controller
{
    public function index(): JsonResponse
    {
        $modules = TrainingModule::all();
        return response()->json($modules);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'duration' => 'nullable|string',
            'difficulty' => 'nullable|string',
            'icon' => 'nullable|string',
            'is_ai_recommended' => 'nullable|boolean',
        ]);

        $module = TrainingModule::create($validated);
        return response()->json($module, 201);
    }

    public function show(TrainingModule $trainingModule): JsonResponse
    {
        return response()->json($trainingModule);
    }

    public function update(Request $request, TrainingModule $trainingModule): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'duration' => 'nullable|string',
            'difficulty' => 'nullable|string',
            'icon' => 'nullable|string',
            'is_ai_recommended' => 'nullable|boolean',
        ]);

        $trainingModule->update($validated);
        return response()->json($trainingModule->fresh());
    }

    public function destroy(TrainingModule $trainingModule): JsonResponse
    {
        $trainingModule->delete();
        return response()->json(['message' => 'Training module deleted successfully']);
    }
}
