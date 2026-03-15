<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_risk_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->float('score')->default(0)->comment('0 to 100');
            $table->enum('level', ['faible', 'moyen', 'élevé', 'critique'])->default('faible');
            $table->json('features')->nullable()->comment('Behavioral and psychological features used for scoring');
            $table->float('confidence')->default(0)->comment('Model confidence index 0-1');
            $table->timestamp('last_updated')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_risk_scores');
    }
};
