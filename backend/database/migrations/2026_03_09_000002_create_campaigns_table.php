<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status')->default('draft'); // draft, active, completed
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('difficulty_level', ['facile', 'moyen', 'difficile', 'expert'])->default('moyen');
            $table->json('adaptation_params')->nullable();
            $table->boolean('rl_enabled')->default(false);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
