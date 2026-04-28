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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            
            $table->morphs('ticketable'); // ticketable_id + ticketable_type
            $table->foreignId('seat_id')->constrained('seats')->onDelete('cascade'); // seat–ին կապ
            
            $table->string('buyer_name')->nullable();
            $table->string('buyer_email')->nullable();
            $table->decimal('price', 8, 2);
            $table->enum('status', ['reserved', 'purchased', 'buy'])->default('reserved');
            
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
