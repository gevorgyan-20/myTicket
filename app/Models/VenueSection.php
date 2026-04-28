<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VenueSection extends Model
{
    use HasFactory;

    protected $fillable = ['venue_id', 'label', 'color'];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function seats()
    {
        return $this->hasMany(VenueSeat::class);
    }
}
