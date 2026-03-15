<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rl_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->json('campaign_params')->nullable()->comment('Tone, urgency, complexity parameters');
            $table->float('rewards')->default(0)->comment('Reward signal from RL algorithm');
            $table->json('state')->nullable()->comment('Stored state for the RL algorithm');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rl_policies');
    }
};
