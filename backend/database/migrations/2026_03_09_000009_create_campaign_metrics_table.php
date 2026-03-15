<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaign_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->float('ctr')->default(0)->comment('Click-Through Rate');
            $table->float('precision')->default(0)->comment('ML model precision');
            $table->float('auc_roc')->default(0)->comment('AUC-ROC score');
            $table->json('statistical_tests')->nullable()->comment('p-values, t-tests, ANOVA results');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_metrics');
    }
};
