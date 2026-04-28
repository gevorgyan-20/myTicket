<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;
use App\Models\Concert;
use App\Models\Standup;
use App\Models\Showtime;
use App\Models\Venue;

class ShowtimeSeeder extends Seeder
{
    public function run(): void
    {
        $venues = Venue::all();
        if ($venues->isEmpty()) {
            $this->call(VenueSeeder::class);
            $venues = Venue::all();
        }

        $events = collect()
            ->merge(Movie::all())
            ->merge(Concert::all())
            ->merge(Standup::all());

        foreach ($events as $event) {
            // Create 2 showtimes for each event
            for ($i = 0; $i < 2; $i++) {
                $venue = $venues->random();
                
                // Use the event's location if it matches a venue, otherwise random
                // This is just for seeding
                
                $start = now()->addDays(rand(1, 30))->setHour(rand(10, 22))->setMinute(0);
                
                Showtime::create([
                    'showtimeable_id'   => $event->id,
                    'showtimeable_type' => get_class($event),
                    'venue_id'          => $venue->id,
                    'start_time'        => $start,
                    'end_time'          => (clone $start)->addHours(2),
                    'price'             => $event->price ?: 3000,
                ]);
            }
        }
    }
}
