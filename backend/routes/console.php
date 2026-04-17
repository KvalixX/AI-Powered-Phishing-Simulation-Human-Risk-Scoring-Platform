<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Campaign;
use App\Services\PhishingService;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    $campaigns = Campaign::where('status', 'scheduled')
        ->where('started_at', '<=', now())
        ->get();

    if ($campaigns->isNotEmpty()) {
        Log::info("Processing " . $campaigns->count() . " scheduled campaigns.");
        $phishingService = app(PhishingService::class);
        foreach ($campaigns as $campaign) {
            try {
                $phishingService->generateEmailsForCampaign($campaign);
                $phishingService->sendCampaignEmails($campaign);
                Log::info("Successfully launched scheduled campaign: {$campaign->name} (ID: {$campaign->id})");
            } catch (\Exception $e) {
                Log::error("Failed to launch scheduled campaign {$campaign->id}: " . $e->getMessage());
            }
        }
    }
})->everyMinute();
