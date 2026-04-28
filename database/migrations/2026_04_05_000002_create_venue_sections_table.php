<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venue_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained('venues')->cascadeOnDelete();
            $table->string('label');                   // e.g. "Floor A", "VIP", "Balcony"
            $table->string('color', 7)->default('#7C3AED'); // hex colour
            $table->string('price_tier')->nullable();  // e.g. "standard", "vip"
            $table->timestamps();

            $table->index('venue_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venue_sections');
    }
};
