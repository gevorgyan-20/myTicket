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
        $showtimes = \App\Models\Showtime::all();

        foreach ($showtimes as $showtime) {
            // Delete existing seats for this showtime
            Seat::where('showtime_id', $showtime->id)->delete();

            $venueId = $showtime->venue_id;
            
            if ($venueId == 1) {
                $this->seedDesign1($showtime);
            } elseif ($venueId == 2) {
                $this->seedDesign2($showtime);
            } else {
                $this->seedDesign3($showtime);
            }
        }
    }

    private function seedDesign1($showtime)
    {
        for ($row = 1; $row <= 4; $row++) {
            for ($num = 1; $num <= 8; $num++) {
                $this->createSeat($showtime, $row, $num);
            }
        }
        for ($row = 5; $row <= 12; $row++) {
            for ($num = 1; $num <= 13; $num++) {
                $this->createSeat($showtime, $row, $num);
            }
        }
    }

    private function seedDesign2($showtime)
    {
        for ($row = 1; $row <= 15; $row++) {
            for ($num = 1; $num <= 20; $num++) {
                $this->createSeat($showtime, $row, $num);
            }
        }
    }

    private function seedDesign3($showtime)
    {
        for ($row = 1; $row <= 8; $row++) {
            for ($num = 1; $num <= 10; $num++) {
                $this->createSeat($showtime, $row, $num);
            }
        }
    }

    private function createSeat($showtime, $row, $num)
    {
        Seat::create([
            'row'         => $row,
            'number'      => $num,
            'showtime_id' => $showtime->id,
            'status'      => (rand(1, 10) > 8) ? 'reserved' : 'available',
        ]);
    }
}
