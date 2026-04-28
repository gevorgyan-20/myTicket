<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    /**
     * Venues are created by admins through the UI.
     * No default venues are seeded.
     */
    public function run(): void
    {
        // intentionally empty — admins create venues through the admin panel
    }
}

