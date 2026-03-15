<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trainings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->string('type')->comment('video, article, quiz');
            $table->text('content')->comment('URL or content of the training material');
            $table->string('recommended_by')->nullable()->comment('AI model that recommended this training');
            $table->boolean('completed')->default(false);
            $table->float('impact')->nullable()->comment('Score change after completing the training');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainings');
    }
};
