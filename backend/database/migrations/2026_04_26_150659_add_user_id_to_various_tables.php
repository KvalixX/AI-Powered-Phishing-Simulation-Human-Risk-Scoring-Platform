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
        // Departments
        Schema::table('departments', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->dropUnique(['name']);
            $table->unique(['name', 'user_id']);
        });

        // Email Templates
        Schema::table('email_templates', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
        });

        // Training Modules
        Schema::table('training_modules', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
        });

        // Reports (author_id already exists, but let's ensure it's used consistently or add user_id)
        // Reports migration already had author_id. We'll stick with that or add user_id for consistency.
        // Let's add user_id to reports for consistency with the Trait.
        Schema::table('reports', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
        });
        
        // Ensure contacts has user_id (it was added in a previous migration but let's be sure)
        // Actually, it was added in 2026_04_09_220237_add_user_id_to_contacts_and_targets_to_campaigns.php
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropUnique(['name', 'user_id']);
            $table->unique(['name']);
            $table->dropColumn('user_id');
        });

        Schema::table('email_templates', function (Blueprint $table) {
            $table->dropColumn('user_id');
        });

        Schema::table('training_modules', function (Blueprint $table) {
            $table->dropColumn('user_id');
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn('user_id');
        });
    }
};
