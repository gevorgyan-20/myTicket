<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Venue;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        Venue::updateOrCreate(
            ['id' => 1],
            ['name' => 'Moscow Cinema', 'type' => 'theatre', 'address' => 'Abovyan 14', 'capacity' => 120]
        );

        Venue::updateOrCreate(
            ['id' => 2],
            ['name' => 'Hrazdan Stadium', 'type' => 'stadium', 'address' => 'Hrazdan Stadium', 'capacity' => 200]
        );

        Venue::updateOrCreate(
            ['id' => 3],
            ['name' => 'Yerevan Opera Theatre', 'type' => 'theatre', 'address' => 'Yerevan Opera Theatre', 'capacity' => 100]
        );
    }
}
