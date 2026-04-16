<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    public function index(): JsonResponse
    {
        $templates = EmailTemplate::all();
        return response()->json($templates);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content_html' => 'required|string',
            'category' => 'nullable|string',
            'difficulty_level' => 'nullable|in:facile,moyen,difficile,expert',
        ]);

        $template = EmailTemplate::create($validated);
        return response()->json($template, 201);
    }

    public function show(EmailTemplate $emailTemplate): JsonResponse
    {
        return response()->json($emailTemplate);
    }

    public function update(Request $request, EmailTemplate $emailTemplate): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'subject' => 'sometimes|string|max:255',
            'content_html' => 'sometimes|string',
            'category' => 'nullable|string',
            'difficulty_level' => 'nullable|in:facile,moyen,difficile,expert',
        ]);

        $emailTemplate->update($validated);
        return response()->json($emailTemplate->fresh());
    }

    public function destroy(EmailTemplate $emailTemplate): JsonResponse
    {
        $emailTemplate->delete();
        return response()->json(['message' => 'Email template deleted successfully']);
    }
}
