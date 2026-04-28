<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Showtime extends Model
{
    use HasFactory;

    protected $fillable = [
        'showtimeable_id',
        'showtimeable_type',
        'venue_id',
        'start_time',
        'end_time',
        'price',
    ];

    protected $appends = ['min_price', 'max_price'];

    public function getMinPriceAttribute()
    {
        $prices = $this->sectionPrices->pluck('price');
        if ($prices->isEmpty()) return (float) ($this->price ?: 0);
        return (float) $prices->min();
    }

    public function getMaxPriceAttribute()
    {
        $prices = $this->sectionPrices->pluck('price');
        if ($prices->isEmpty()) return (float) ($this->price ?: 0);
        return (float) $prices->max();
    }

    /**
     * Get the parent showtimeable model (Movie, Concert, or Standup).
     */
    public function showtimeable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the venue that owns the showtime.
     */
    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    /**
     * Get the tickets for the showtime.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Get the seats for the showtime.
     */
    public function seats(): HasMany
    {
        return $this->hasMany(Seat::class);
    }

    /**
     * Get the per-section prices for this showtime.
     */
    public function sectionPrices(): HasMany
    {
        return $this->hasMany(ShowtimeSectionPrice::class);
    }
}
