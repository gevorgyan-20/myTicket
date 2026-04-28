<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShowtimeSectionPrice extends Model
{
    use HasFactory;

    protected $fillable = ['showtime_id', 'venue_section_id', 'price'];

    public function showtime(): BelongsTo
    {
        return $this->belongsTo(Showtime::class);
    }

    public function venueSection(): BelongsTo
    {
        return $this->belongsTo(VenueSection::class);
    }
}
