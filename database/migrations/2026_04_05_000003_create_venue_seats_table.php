<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venue_seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained('venues')->cascadeOnDelete();
            $table->foreignId('venue_section_id')
                  ->nullable()
                  ->constrained('venue_sections')
                  ->nullOnDelete();

            $table->string('label', 20);                            // "A1", "Table 3"
            $table->enum('type', ['seat', 'table', 'standing'])->default('seat');

            $table->decimal('x', 8, 2);                            // canvas x-coordinate (px)
            $table->decimal('y', 8, 2);                            // canvas y-coordinate (px)
            $table->smallInteger('rotation')->default(0);          // degrees 0–359

            // 'removed' = soft-deleted after a re-publish (preserves ticket FK refs)
            $table->enum('status', ['active', 'broken', 'removed'])->default('active');
            $table->timestamps();

            $table->index(['venue_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venue_seats');
    }
};
