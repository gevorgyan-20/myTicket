<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite doesn't support modifying enums easily, but for MySQL/PostgreSQL:
        Schema::table('venue_seats', function (Blueprint $table) {
            $table->string('type')->default('seat')->change(); // Temporary convert to string to reset enum
        });

        // If you are using MySQL, you can redefine the enum if needed
        // DB::statement("ALTER TABLE venue_seats MODIFY COLUMN type ENUM('seat', 'standing') DEFAULT 'seat'");
    }

    public function down(): void
    {
        Schema::table('venue_seats', function (Blueprint $table) {
            $table->string('type')->default('seat')->change();
        });
    }
};
