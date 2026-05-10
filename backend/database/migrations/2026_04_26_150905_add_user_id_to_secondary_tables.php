<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'user_risk_scores',
            'behavioral_events',
            'email_clicks',
            'campaign_metrics',
            'rl_policies',
            'trainings',
            'sent_phishing_emails'
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'user_risk_scores',
            'behavioral_events',
            'email_clicks',
            'campaign_metrics',
            'rl_policies',
            'trainings',
            'sent_phishing_emails'
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropColumn('user_id');
            });
        }
    }
};
