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
        DB::statement("ALTER TABLE sent_phishing_emails MODIFY COLUMN status ENUM('pending', 'sent', 'opened', 'clicked', 'reported') DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE sent_phishing_emails MODIFY COLUMN status ENUM('sent', 'opened', 'clicked', 'reported') DEFAULT 'sent'");
    }
};
