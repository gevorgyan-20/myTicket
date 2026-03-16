<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Seat;
use App\Models\Movie;
use App\Models\Concert;
use App\Models\Standup;
use App\Models\Venue;

class SeatSeeder extends Seeder
{
    public function run(): void
    {
        $events = collect()
            ->merge(Movie::all())
            ->merge(Concert::all())
            ->merge(Standup::all());

        foreach ($events as $event) {
            $venueId = $event->venue_id ?: ($event->id % 3 + 1); // Fallback to a venue ID if none assigned
            
            Seat::where('seatable_id', $event->id)
                ->where('seatable_type', get_class($event))
                ->delete();

            if ($venueId == 1) {
                $this->seedDesign1($event);
            } elseif ($venueId == 2) {
                $this->seedDesign2($event);
            } else {
                $this->seedDesign3($event);
            }
        }
    }

    private function seedDesign1($event)
    {
        for ($row = 1; $row <= 4; $row++) {
            for ($num = 1; $num <= 8; $num++) {
                $this->createSeat($event, $row, $num);
            }
        }
        for ($row = 5; $row <= 12; $row++) {
            for ($num = 1; $num <= 13; $num++) {
                $this->createSeat($event, $row, $num);
            }
        }
    }

    private function seedDesign2($event)
    {
        for ($row = 1; $row <= 15; $row++) {
            for ($num = 1; $num <= 20; $num++) {
                $this->createSeat($event, $row, $num);
            }
        }
    }

    private function seedDesign3($event)
    {
        for ($row = 1; $row <= 8; $row++) {
            for ($num = 1; $num <= 10; $num++) {
                $this->createSeat($event, $row, $num);
            }
        }
    }

    private function createSeat($event, $row, $num)
    {
        Seat::create([
            'row'           => $row,
            'number'        => $num,
            'seatable_id'   => $event->id,
            'seatable_type' => get_class($event),
            'status'        => (rand(1, 10) > 8) ? 'reserved' : 'available',
        ]);
    }
}
