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
        'showtime_id',
        'seat_id',
        'user_id',
        'buyer_name',
        'buyer_email',
        'price',
        'status',
        'stripe_payment_intent_id',
        'reserved_until',
    ];

    protected $casts = [
        'reserved_until' => 'datetime',
        'price'          => 'decimal:2',
    ];


    // Կապը user-ի հետ
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // կապ showtime-ի հետ
    public function showtime(): BelongsTo
    {
        return $this->belongsTo(Showtime::class);
    }

    // կապ seat-ի հետ
    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }

    // կապ venue seat-ի հետ (spatial layout)
    public function venueSeat(): BelongsTo
    {
        return $this->belongsTo(VenueSeat::class, 'seat_id');
    }

    protected $appends = ['event_title', 'total_paid'];

    public function getEventTitleAttribute()
    {
        return $this->showtime?->showtimeable?->title ?? 
               $this->showtime?->showtimeable?->comedian ?? 
               'Event';
    }

    public function getTotalPaidAttribute()
    {
        return $this->price;
    }
}