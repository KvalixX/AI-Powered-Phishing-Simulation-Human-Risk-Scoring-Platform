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
        // Minimal valid PDF 1.7 content (base64 encoded to preserve exact bytes)
        $pdfBase64 = "JVBERi0xLjcKMSAwIG9iaiA8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4gZW5kb2JqCjIgMCBvYmogPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4gZW5kb2JqCjMgMCBvYmogPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4gPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+IGVuZG9iago0IDAgb2JqIDw8IC9MZW5ndGggNzAgPj4gc3RyZWFtCkJUIC9GMSAxMiBUZiA3MiA3MjAgVGQgKFJhcHBvcnQgZGUgUGhpc2hpbmcgS2lyYTog" . base64_encode($report->title) . "IGV0IGVuZHN0cmVhbSBlbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTYgMDAwMDAgbiAKMDAwMDAwMDEwNSAwMDAwMCBuIAowMDAwMDAwMjQzIDAwMDAwIG4gCnRyYWlsZXIgPDwgL1NpemUgNSAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKMzU5CiUlRU9G";
        
        // Actually, just using a cleaner base64 for a generic valid PDF
        $pdf = base64_decode("JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCA1OTUgODQyXS9QYXJlbnQgMiAwIFIvUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pi9Db250ZW50cyA1IDAgUj4+ZW5kb2JqCjQgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PmVuZG9iago1IDAgb2JqPDwvTGVuZ3RoIDQ0Pj5zdHJlYW0KQlQgL0YxIDEyIFRmIDcyIDcyMCBUZCAoUmFwcG9ydCBQaGlzaGluZyBLaXJhKSBUaiBFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDUyIDAwMDAwIG4gCjAwMDAwMDAxMDcgMDAwMDAgbiAKMDAwMDAwMDIxMiAwMDAwMCBuIAowMDAwMDAwMjc1IDAwMDAwIG4gCnRyYWlsZXI8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozNjgKJSVFT0Y=");

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="report-'.$report->id.'.pdf"',
        ]);
    }
}
