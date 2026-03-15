<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('behavioral_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->enum('event_type', ['click', 'submission', 'report', 'ignore']);
            $table->integer('reaction_time')->nullable()->comment('Milliseconds from email receipt to action');
            $table->string('device')->nullable();
            $table->string('ip_address')->nullable();
            $table->json('context')->nullable()->comment('Additional contextual data (location, OS, etc.)');
            $table->timestamp('event_timestamp')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('behavioral_events');
    }
};
