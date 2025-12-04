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
        Schema::table('tickets', function (Blueprint $table) {
            $table->foreignId('user_id')
                  ->nullable() // Թույլատրում է NULL արժեքներ (եթե ցանկանում եք anonymous գնումներ)
                  ->constrained() // Ավտոմատ կապում է `users` աղյուսակի հետ
                  ->after('seat_id'); // Տեղադրում է seat_id-ից հետո՝ կառուցվածքը մաքուր պահելու համար
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id'); 
        });
    }
};