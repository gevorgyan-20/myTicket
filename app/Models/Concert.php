<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Concert extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'performer',
        'genre',
        'start_time',
        'end_time',
        'location',
        'poster_url',
        'venue_id',
        'price',
        'allow_standing'
    ];

    protected $casts = [
        'allow_standing' => 'boolean',
    ];

    protected $appends = ['min_price', 'max_price', 'first_show_date', 'last_show_date'];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function showtimes()
    {
        return $this->morphMany(Showtime::class, 'showtimeable');
    }

    public function getMinPriceAttribute()
    {
        $prices = $this->showtimes->flatMap(fn($st) => $st->sectionPrices->pluck('price'));
        if ($prices->isEmpty())
            return (float) ($this->price ?: 0);
        return (float) $prices->min();
    }

    public function getMaxPriceAttribute()
    {
        $prices = $this->showtimes->flatMap(fn($st) => $st->sectionPrices->pluck('price'));
        if ($prices->isEmpty())
            return (float) ($this->price ?: 0);
        return (float) $prices->max();
    }

    public function getFirstShowDateAttribute()
    {
        return $this->showtimes->min('start_time');
    }

    public function getLastShowDateAttribute()
    {
        return $this->showtimes->max('start_time');
    }
}
