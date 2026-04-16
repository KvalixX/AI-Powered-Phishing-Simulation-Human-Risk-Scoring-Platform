<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(): JsonResponse
    {
        $reports = Report::with('author')->get();
        return response()->json($reports);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string',
            'status' => 'nullable|string',
            'size' => 'nullable|string',
            'file_path' => 'nullable|string',
        ]);

        $validated['author_id'] = auth()->id() ?? 1;
        $report = Report::create($validated);
        return response()->json($report->load('author'), 201);
    }

    public function show(Report $report): JsonResponse
    {
        return response()->json($report->load('author'));
    }

    public function update(Request $request, Report $report): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'type' => 'sometimes|string',
            'status' => 'nullable|string',
            'size' => 'nullable|string',
        ]);

        $report->update($validated);
        return response()->json($report->fresh()->load('author'));
    }

    public function destroy(Report $report): JsonResponse
    {
        $report->delete();
        return response()->json(['message' => 'Report deleted successfully']);
    }

    public function download(Report $report)
    {
        // Mocking a PDF content download
        return response('Mock PDF content for report: ' . $report->title, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="report-'.$report->id.'.pdf"',
        ]);
    }
}
