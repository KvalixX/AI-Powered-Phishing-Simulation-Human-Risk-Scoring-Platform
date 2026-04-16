<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            // Remove unique constraint from email if we want different users to add same email natively?
            // Actually, keep it simple for now, or just leave it. If contacts belong to user, user_id should be there.
        });

        Schema::table('campaigns', function (Blueprint $table) {
            $table->json('target_departments')->nullable()->after('difficulty_level');
            $table->json('target_contacts')->nullable()->after('target_departments');
        });
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn('user_id');
        });

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['target_departments', 'target_contacts']);
        });
    }
};
