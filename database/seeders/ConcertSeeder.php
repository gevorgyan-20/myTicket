<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Concert;

class ConcertSeeder extends Seeder
{
    public function run(): void
    {
        $concerts = [
            [
                'title' => 'Armenian Symphony Orchestra Concert',
                'description' => 'A classical music evening in Gyumri.',
                'performer' => 'Armenian Symphony Orchestra',
                'start_time' => '2025-10-01 19:00:00',
                'end_time' => '2025-10-01 21:00:00',
                'location' => 'Gyumri Theater Hall',
            ],
            [
                'title' => 'Sirusho Solo Concert',
                'description' => 'Sirusho’s new album presentation concert.',
                'performer' => 'Sirusho',
                'start_time' => '2025-10-05 20:00:00',
                'end_time' => '2025-10-05 22:30:00',
                'location' => 'Karen Demirchyan Sports and Concert Complex',
            ],
            [
                'title' => 'Aram MP3 Live Show',
                'description' => 'Aram MP3’s big solo concert in Yerevan.',
                'performer' => 'Aram MP3',
                'start_time' => '2025-10-12 19:30:00',
                'end_time' => '2025-10-12 22:00:00',
                'location' => 'Yerevan, Aram Khachaturian Concert Hall',
            ],
            [
                'title' => 'Iveta Mukuchyan Unplugged',
                'description' => 'Iveta’s acoustic concert with her favorite hits.',
                'performer' => 'Iveta Mukuchyan',
                'start_time' => '2025-10-18 20:00:00',
                'end_time' => '2025-10-18 22:30:00',
                'location' => 'Cafesjian Center for the Arts',
            ],
            [
                'title' => 'System of a Down Tribute Night',
                'description' => 'Tribute concert to System of a Down performed by Armenian rock bands.',
                'performer' => 'Various Bands',
                'start_time' => '2025-10-20 21:00:00',
                'end_time' => '2025-10-20 23:30:00',
                'location' => 'Rock Club, Yerevan',
            ],
            [
                'title' => 'Spitakci Hayko Concert',
                'description' => 'Performances of folk and modern Armenian songs.',
                'performer' => 'Spitakci Hayko',
                'start_time' => '2025-10-25 20:00:00',
                'end_time' => '2025-10-25 23:00:00',
                'location' => 'Vanadzor Palace of Culture',
            ],
            [
                'title' => 'Eva Rivas Live',
                'description' => 'Eva Rivas solo concert with world hits.',
                'performer' => 'Eva Rivas',
                'start_time' => '2025-11-02 19:00:00',
                'end_time' => '2025-11-02 21:00:00',
                'location' => 'Yerevan, Aram Khachaturian Concert Hall',
            ],
            [
                'title' => 'Gor Sepuh Unplugged',
                'description' => 'An acoustic evening with Gor Sepuh.',
                'performer' => 'Gor Sepuh',
                'start_time' => '2025-11-07 20:00:00',
                'end_time' => '2025-11-07 22:00:00',
                'location' => 'Congress Hotel, Yerevan',
            ],
            [
                'title' => 'Armenian Jazz Night',
                'description' => 'The best of Armenian jazz performances.',
                'performer' => 'Various Jazz Musicians',
                'start_time' => '2025-11-10 21:00:00',
                'end_time' => '2025-11-10 23:30:00',
                'location' => 'Mezzo Classic House Club',
            ],
            [
                'title' => 'Gata Band Live',
                'description' => 'Gata Band solo concert with a new program.',
                'performer' => 'Gata Band',
                'start_time' => '2025-11-15 20:00:00',
                'end_time' => '2025-11-15 23:00:00',
                'location' => 'Gyumri, Black Box Club',
            ],
            [
                'title' => 'Lilit Hovhannisyan Concert',
                'description' => 'Lilit Hovhannisyan’s big solo concert.',
                'performer' => 'Lilit Hovhannisyan',
                'start_time' => '2025-11-20 20:00:00',
                'end_time' => '2025-11-20 22:30:00',
                'location' => 'Areni Theater, Yerevan',
            ],
            [
                'title' => 'Ruben Hakhverdyan Live',
                'description' => 'A grand concert of Ruben Hakhverdyan’s original songs.',
                'performer' => 'Ruben Hakhverdyan',
                'start_time' => '2025-11-25 19:00:00',
                'end_time' => '2025-11-25 21:30:00',
                'location' => 'Yerevan Opera Theatre',
            ],
            [
                'title' => 'Zara Live Show',
                'description' => 'Zara’s solo concert with a new program.',
                'performer' => 'Zara',
                'start_time' => '2025-11-30 20:00:00',
                'end_time' => '2025-11-30 22:00:00',
                'location' => 'Yerevan, Karen Demirchyan Sports and Concert Complex',
            ],
            [
                'title' => 'Armenian Folk Music Evening',
                'description' => 'Traditional music and dance performances.',
                'performer' => 'Various Ensembles',
                'start_time' => '2025-12-05 18:30:00',
                'end_time' => '2025-12-05 21:00:00',
                'location' => 'Gyumri House of Culture',
            ],
            [
                'title' => 'Sona Shahgeldyan Concert',
                'description' => 'Live performance of Sona’s best songs.',
                'performer' => 'Sona Shahgeldyan',
                'start_time' => '2025-12-10 20:00:00',
                'end_time' => '2025-12-10 22:30:00',
                'location' => 'Komitas Chamber Music House, Yerevan',
            ],
        ];

        foreach ($concerts as $data) {
            Concert::updateOrCreate(
                ['title' => $data['title']], // if same title exists, update
                $data
            );
        }
    }
}
