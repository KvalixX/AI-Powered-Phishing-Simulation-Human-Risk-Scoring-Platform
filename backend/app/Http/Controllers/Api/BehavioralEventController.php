<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BehavioralEvent;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BehavioralEventController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'contact_id' => 'required|exists:contacts,id',
            'campaign_id' => 'required|exists:campaigns,id',
            'event_type' => 'required|in:click,submission,report,ignore',
            'reaction_time' => 'nullable|integer|min:0',
            'device' => 'nullable|string|max:100',
            'ip_address' => 'nullable|ip',
            'context' => 'nullable|array',
            'event_timestamp' => 'nullable|date',
        ]);

        $validated['event_timestamp'] = $validated['event_timestamp'] ?? now();
        $event = BehavioralEvent::create($validated);

        return response()->json($event, 201);
    }

    public function byContact(Contact $contact): JsonResponse
    {
        $events = $contact->behavioralEvents()
            ->with('campaign')
            ->orderBy('event_timestamp', 'desc')
            ->get();

        return response()->json($events);
    }

    public function index(Request $request): JsonResponse
    {
        $query = BehavioralEvent::with(['contact', 'campaign']);

        if ($request->has('event_type')) {
            $query->where('event_type', $request->event_type);
        }
        if ($request->has('campaign_id')) {
            $query->where('campaign_id', $request->campaign_id);
        }

        return response()->json($query->orderBy('event_timestamp', 'desc')->get());
    }
}
