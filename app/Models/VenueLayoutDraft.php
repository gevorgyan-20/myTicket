<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VenueLayoutDraft extends Model
{
    use HasFactory;

    protected $fillable = ['venue_id', 'snapshot'];

    protected $casts = [
        'snapshot' => 'array',
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }
}
