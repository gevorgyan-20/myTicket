<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    // Անհրաժեշտ է, նույնիսկ եթե factory-ն չենք օգտագործում, լավ պրակտիկա է
    use HasFactory; 

    protected $fillable = [
        // ԿՐԻՏԻԿԱԿԱՆ ԴԱՇՏԵՐ՝ 500 ՍԽԱԼԸ ԼՈՒԾԵԼՈՒ ՀԱՄԱՐ
        'ticketable_id',   // Իրադարձության ID (ֆիլմ, համերգ և այլն)
        'ticketable_type', // Իրադարձության տեսակը (Movie, Concert և այլն)
        'seat_id',
        'user_id', 
        'buyer_name',
        'buyer_email',
        'price',
        'status',
    ];

    // Կապը user-ի հետ
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // կապ ticketable-ի հետ (poly-morphic)
    public function ticketable(): MorphTo
    {
        return $this->morphTo();
    }

    // կապ seat-ի հետ
    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }
}