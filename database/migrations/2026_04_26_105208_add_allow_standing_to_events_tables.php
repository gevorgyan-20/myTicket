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
            $table->boolean('allow_standing')->default(true)->after('description');
        });
        Schema::table('movies', function (Blueprint $table) {
            $table->boolean('allow_standing')->default(true)->after('description');
        });
        Schema::table('standups', function (Blueprint $table) {
            $table->boolean('allow_standing')->default(true)->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('concerts', function (Blueprint $table) {
            $table->dropColumn('allow_standing');
        });
        Schema::table('movies', function (Blueprint $table) {
            $table->dropColumn('allow_standing');
        });
        Schema::table('standups', function (Blueprint $table) {
            $table->dropColumn('allow_standing');
        });
    }
};
