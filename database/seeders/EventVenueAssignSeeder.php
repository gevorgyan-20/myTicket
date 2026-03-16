<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;
use App\Models\Concert;
use App\Models\Standup;

class EventVenueAssignSeeder extends Seeder
{
    public function run(): void
    {
        $movies = Movie::all();
        foreach ($movies as $index => $movie) {
            $movie->update(['venue_id' => ($index % 3) + 1]);
        }

        $concerts = Concert::all();
        foreach ($concerts as $index => $concert) {
            $concert->update(['venue_id' => ($index % 3) + 1]);
        }

        $standups = Standup::all();
        foreach ($standups as $index => $standup) {
            $standup->update(['venue_id' => ($index % 3) + 1]);
        }
    }
}
