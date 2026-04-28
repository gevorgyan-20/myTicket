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
        // Add price to movies, concerts, standups 
        Schema::table('movies', function (Blueprint $table) {
            if (!Schema::hasColumn('movies', 'price')) {
                $table->decimal('price', 10, 2)->default(0)->after('duration');
            }
        });

        Schema::table('concerts', function (Blueprint $table) {
            if (!Schema::hasColumn('concerts', 'price')) {
                $table->decimal('price', 10, 2)->default(0)->after('end_time');
            }
        });

        Schema::table('standups', function (Blueprint $table) {
            if (!Schema::hasColumn('standups', 'price')) {
                $table->decimal('price', 10, 2)->default(0)->after('end_time');
            }
        });

        // Create showtimes (seanses) table
        if (!Schema::hasTable('showtimes')) {
            Schema::create('showtimes', function (Blueprint $table) {
                $table->id();
                $table->morphs('showtimeable'); // Movie, Concert, Standup
                $table->foreignId('venue_id')->constrained('venues')->onDelete('cascade');
                $table->dateTime('start_time');
                $table->dateTime('end_time')->nullable();
                $table->decimal('price', 10, 2)->nullable(); // Overwrites event price if set
                $table->timestamps();
            });
        }

        // Update tickets table to point to showtimes
        if (Schema::hasColumn('tickets', 'ticketable_id')) {
             \Illuminate\Support\Facades\DB::table('tickets')->truncate();
        }
        Schema::table('tickets', function (Blueprint $table) {
            if (Schema::hasColumn('tickets', 'ticketable_id')) {
                $table->dropMorphs('ticketable');
            }
            if (!Schema::hasColumn('tickets', 'showtime_id')) {
                $table->foreignId('showtime_id')->after('id')->constrained('showtimes')->onDelete('cascade');
            }
        });
        
        // Update seats table to point to showtimes
        if (Schema::hasColumn('seats', 'seatable_id')) {
             \Illuminate\Support\Facades\DB::table('seats')->truncate();
        }
        Schema::table('seats', function (Blueprint $table) {
            if (Schema::hasColumn('seats', 'seatable_id')) {
                $table->dropMorphs('seatable');
            }
            if (!Schema::hasColumn('seats', 'showtime_id')) {
                $table->foreignId('showtime_id')->after('id')->constrained('showtimes')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seats', function (Blueprint $table) {
            $table->dropConstrainedForeignId('showtime_id');
            $table->morphs('seatable');
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropConstrainedForeignId('showtime_id');
            $table->morphs('ticketable');
        });

        Schema::dropIfExists('showtimes');

        Schema::table('standups', function (Blueprint $table) {
            $table->dropColumn('price');
        });

        Schema::table('concerts', function (Blueprint $table) {
            $table->dropColumn('price');
        });

        Schema::table('movies', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};
