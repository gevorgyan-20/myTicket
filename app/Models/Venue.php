<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'address', 'capacity'];

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
}
