<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Concert extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'performer', 'start_time', 'end_time', 'location', 'venue_id'
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function seats()
    {
        return $this->morphMany(Seat::class, 'seatable');
    }

    public function tickets()
    {
        return $this->morphMany(Ticket::class, 'ticketable');
    }
}
