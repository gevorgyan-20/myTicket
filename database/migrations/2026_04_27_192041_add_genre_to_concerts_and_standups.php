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
        Schema::table('concerts', function (Blueprint $table) {
            $table->string('genre')->nullable()->after('description');
        });

        Schema::table('standups', function (Blueprint $table) {
            $table->string('genre')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('concerts', function (Blueprint $table) {
            $table->dropColumn('genre');
        });

        Schema::table('standups', function (Blueprint $table) {
            $table->dropColumn('genre');
        });
    }
};
