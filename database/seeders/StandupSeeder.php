<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Standup;

class StandupSeeder extends Seeder
{
    public function run(): void
    {
        $standups = [
            [
                'title' => 'Narek Makaryan Stand-up Show',
                'description' => 'A comedy evening with Narek Makaryan.',
                'comedian' => 'Narek Makaryan',
                'start_time' => '2025-09-20 19:00:00',
                'end_time' => '2025-09-20 21:00:00',
                'location' => 'Karen Demirchyan Sports and Concert Complex',
            ],
            [
                'title' => 'Arsen Petrosyan Comedy Night',
                'description' => 'A solo stand-up evening by Arsen Petrosyan.',
                'comedian' => 'Arsen Petrosyan',
                'start_time' => '2025-09-25 20:00:00',
                'end_time' => '2025-09-25 22:00:00',
                'location' => 'State Puppet Theatre named after Hovhannes Tumanyan',
            ],
            [
                'title' => 'Vardan Hovhannisyan Live',
                'description' => 'A new program full of fresh jokes by Vardan Hovhannisyan.',
                'comedian' => 'Vardan Hovhannisyan',
                'start_time' => '2025-10-01 19:30:00',
                'end_time' => '2025-10-01 21:00:00',
                'location' => 'Gyumri, Culture House named after Teryan',
            ],
            [
                'title' => 'Gor Hakobyan Stand-up Evening',
                'description' => 'An evening with Gor Hakobyan full of humor and surprises.',
                'comedian' => 'Gor Hakobyan',
                'start_time' => '2025-10-05 19:00:00',
                'end_time' => '2025-10-05 21:00:00',
                'location' => 'Moscow Cinema',
            ],
            [
                'title' => 'Sos Janibekyan Stand-up Performance',
                'description' => 'Stand-up performance by Sos Janibekyan with sarcastic and funny themes.',
                'comedian' => 'Sos Janibekyan',
                'start_time' => '2025-10-10 20:00:00',
                'end_time' => '2025-10-10 22:00:00',
                'location' => 'Hall named after Hrant Matevosyan',
            ],
            [
                'title' => 'Mench Special',
                'description' => 'Special stand-up program by Armen Petrosyan (Mench).',
                'comedian' => 'Armen Petrosyan (Mench)',
                'start_time' => '2025-10-15 19:00:00',
                'end_time' => '2025-10-15 21:00:00',
                'location' => 'Swan Lake, Open Air Stage',
            ],
            [
                'title' => 'Armenian Stand-up Night',
                'description' => 'A joint performance by several young Armenian stand-up comedians.',
                'comedian' => 'Various Artists',
                'start_time' => '2025-10-20 19:00:00',
                'end_time' => '2025-10-20 22:00:00',
                'location' => 'Vanadzor, Palace of Culture',
            ],
            [
                'title' => 'Ruslan Bely in Armenia',
                'description' => 'Performance by the famous Russian stand-up comedian Ruslan Bely.',
                'comedian' => 'Ruslan Bely',
                'start_time' => '2025-10-25 19:00:00',
                'end_time' => '2025-10-25 21:00:00',
                'location' => 'Karen Demirchyan Sports and Concert Complex',
            ],
            [
                'title' => 'Pavel Volya Comedy Show',
                'description' => 'Performance by Pavel Volya with fresh and sharp humor.',
                'comedian' => 'Pavel Volya',
                'start_time' => '2025-10-28 20:00:00',
                'end_time' => '2025-10-28 22:00:00',
                'location' => 'Malatia Culture House',
            ],
            [
                'title' => 'Arsen Grigoryan Stand-up',
                'description' => 'A light and funny performance by Arsen Grigoryan.',
                'comedian' => 'Arsen Grigoryan',
                'start_time' => '2025-11-02 19:30:00',
                'end_time' => '2025-11-02 21:00:00',
                'location' => 'Gyumri, Theatre named after Vardan Adjemyan',
            ],
            [
                'title' => 'Kamo Seyranyan Live',
                'description' => 'Comedic stories and observations by Kamo Seyranyan.',
                'comedian' => 'Kamo Seyranyan',
                'start_time' => '2025-11-07 19:00:00',
                'end_time' => '2025-11-07 21:00:00',
                'location' => 'Hakob Paronyan Theatre',
            ],
            [
                'title' => 'Stand-up Yerevan Night',
                'description' => 'A performance by young stand-up comedians from Yerevan.',
                'comedian' => 'Various Artists',
                'start_time' => '2025-11-12 20:00:00',
                'end_time' => '2025-11-12 22:00:00',
                'location' => 'Moscow Cinema Small Hall',
            ],
            [
                'title' => 'Ivan Abramov in Yerevan',
                'description' => 'Performance by the famous Russian stand-up comedian Ivan Abramov.',
                'comedian' => 'Ivan Abramov',
                'start_time' => '2025-11-18 19:00:00',
                'end_time' => '2025-11-18 21:00:00',
                'location' => 'National Academic Theatre of Armenia',
            ],
            [
                'title' => 'Comedy Mix',
                'description' => 'A special evening with several Armenian comedians performing together.',
                'comedian' => 'Various Artists',
                'start_time' => '2025-11-22 19:00:00',
                'end_time' => '2025-11-22 21:30:00',
                'location' => 'Vanadzor, Palace of Culture',
            ],
            [
                'title' => 'Hakob Mkrtchyan Stand-up Performance',
                'description' => 'A solo stand-up performance by Hakob Mkrtchyan.',
                'comedian' => 'Hakob Mkrtchyan',
                'start_time' => '2025-11-28 20:00:00',
                'end_time' => '2025-11-28 22:00:00',
                'location' => 'Malkhas Jazz Club',
            ],
        ];

        foreach ($standups as $data) {
            Standup::updateOrCreate(
                ['title' => $data['title']], // If same title exists, update
                $data
            );
        }
    }
}
