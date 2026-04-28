<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            $table->enum('layout_status', ['none', 'draft', 'published'])->default('none')->after('capacity');
            $table->unsignedSmallInteger('canvas_width')->default(1200)->after('layout_status');
            $table->unsignedSmallInteger('canvas_height')->default(800)->after('canvas_width');
        });
    }

    public function down(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            $table->dropColumn(['layout_status', 'canvas_width', 'canvas_height']);
        });
    }
};
