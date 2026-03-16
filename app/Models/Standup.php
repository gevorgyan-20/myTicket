<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Standup extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'comedian', 'start_time', 'end_time', 'location', 'venue_id'
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    // Կապ seat-երի հետ
    public function seats()
    {
        return $this->morphMany(Seat::class, 'seatable');
    }

    // Կապ ticket-երի հետ
    public function tickets()
    {
        return $this->morphMany(Ticket::class, 'ticketable');
    }
}
