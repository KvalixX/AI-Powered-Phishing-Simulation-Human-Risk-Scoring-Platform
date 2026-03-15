<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('email_clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->integer('reaction_time')->nullable()->comment('Milliseconds from email sent to click');
            $table->string('time_of_day')->nullable()->comment('morning, afternoon, evening, night');
            $table->tinyInteger('day_of_week')->nullable()->comment('0=Monday, 6=Sunday');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_clicks');
    }
};
