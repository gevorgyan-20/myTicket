<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'type', 'address', 'capacity',
        'layout_status', 'canvas_width', 'canvas_height',
    ];

    public function movies()
    {
        return $this->hasMany(Movie::class);
    }

    public function concerts()
    {
        return $this->hasMany(Concert::class);
    }

    public function standups()
    {
        return $this->hasMany(Standup::class);
    }

    public function sections()
    {
        return $this->hasMany(VenueSection::class);
    }

    public function venueSeats()
    {
        return $this->hasMany(VenueSeat::class);
    }

    public function layoutDraft()
    {
        return $this->hasOne(VenueLayoutDraft::class);
    }

    public function showtimes()
    {
        return $this->hasMany(Showtime::class);
    }
}
