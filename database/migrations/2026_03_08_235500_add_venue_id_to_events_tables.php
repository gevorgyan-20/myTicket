<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('movies', function (Blueprint $table) {
            $table->foreignId('venue_id')->nullable()->constrained('venues')->nullOnDelete();
        });

        Schema::table('concerts', function (Blueprint $table) {
            $table->foreignId('venue_id')->nullable()->constrained('venues')->nullOnDelete();
        });

        Schema::table('standups', function (Blueprint $table) {
            $table->foreignId('venue_id')->nullable()->constrained('venues')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('movies', function (Blueprint $table) {
            $table->dropForeign(['venue_id']);
            $table->dropColumn('venue_id');
        });

        Schema::table('concerts', function (Blueprint $table) {
            $table->dropForeign(['venue_id']);
            $table->dropColumn('venue_id');
        });

        Schema::table('standups', function (Blueprint $table) {
            $table->dropForeign(['venue_id']);
            $table->dropColumn('venue_id');
        });
    }
};
