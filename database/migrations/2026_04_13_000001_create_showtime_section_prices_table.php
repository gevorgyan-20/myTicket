<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('showtime_section_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('showtime_id')
                  ->constrained('showtimes')
                  ->cascadeOnDelete();
            $table->foreignId('venue_section_id')
                  ->constrained('venue_sections')
                  ->cascadeOnDelete();
            $table->decimal('price', 10, 2)->default(0);
            $table->timestamps();

            $table->unique(['showtime_id', 'venue_section_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('showtime_section_prices');
    }
};
