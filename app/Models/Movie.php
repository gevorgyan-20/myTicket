<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'genre', 'duration', 'release_date', 'poster_url', 'venue_id'];

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
