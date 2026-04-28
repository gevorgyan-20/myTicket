<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('venue_seats', function (Blueprint $table) {
            $table->decimal('width', 8, 2)->nullable()->after('y');
            $table->decimal('height', 8, 2)->nullable()->after('width');
            $table->string('label', 20)->nullable()->change(); // Allow null labels for zones
        });
    }

    public function down(): void
    {
        Schema::table('venue_seats', function (Blueprint $table) {
            $table->dropColumn(['width', 'height']);
            $table->string('label', 20)->nullable(false)->change();
        });
    }
};
