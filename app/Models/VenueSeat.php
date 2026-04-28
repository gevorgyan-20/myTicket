<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VenueSeat extends Model
{
    use HasFactory;

    protected $fillable = [
        'venue_id', 'venue_section_id',
        'label', 'type',
        'x', 'y', 'rotation',
        'status',
    ];

    protected $casts = [
        'x'        => 'float',
        'y'        => 'float',
        'rotation' => 'integer',
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function section()
    {
        return $this->belongsTo(VenueSection::class, 'venue_section_id');
    }
}
