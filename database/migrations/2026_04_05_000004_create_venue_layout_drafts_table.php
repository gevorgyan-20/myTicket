<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venue_layout_drafts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')
                  ->unique()                // one draft per venue
                  ->constrained('venues')
                  ->cascadeOnDelete();
            $table->json('snapshot');      // full serialised layout (sections + seats)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venue_layout_drafts');
    }
};
