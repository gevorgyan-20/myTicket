<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    use HasFactory;

    protected $fillable = ['row', 'number', 'status'];

    public function seatable()
    {
        return $this->morphTo();
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}

