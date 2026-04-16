<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrackingController;

Route::get('/', function () {
    return view('welcome');
});

// ─── PUBLIC TRACKING ENDPOINT ───────────────────────────────────────────
Route::get('/track/click/{campaignId}/{contactId}', [TrackingController::class, 'trackClick'])->name('track.click');
Route::get('/track/report/{campaignId}/{contactId}', [TrackingController::class, 'trackReport'])->name('track.report');
