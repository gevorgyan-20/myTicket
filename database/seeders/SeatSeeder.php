<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Seat;
use App\Models\Movie;
use App\Models\Concert;
use App\Models\Standup;

class SeatSeeder extends Seeder
{
    public function run(): void
    {
        // ունենք 7 շարք (A–G), ամեն շարքում՝ 8 տեղ
        $rows = range('A', 'G'); 
        $seatsPerRow = 8;

        // հավաքում ենք բոլոր event-ները
        $events = collect()
            ->merge(Movie::all())
            ->merge(Concert::all())
            ->merge(Standup::all());

        foreach ($events as $event) {
            foreach ($rows as $row) {
                for ($i = 1; $i <= $seatsPerRow; $i++) {
                    Seat::updateOrCreate(
                        [
                            'row'           => $row,
                            'number'        => $i,
                            'seatable_id'   => $event->id,
                            'seatable_type' => get_class($event),
                        ],
                        [
                            'status' => 'available', // կարող ես հանել, եթե ուզում ես պահպանել նախկին status-ը
                        ]
                    );
                }
            }
        }
    }
}
