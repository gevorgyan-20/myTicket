<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;

class MovieSeeder extends Seeder
{
    public function run(): void
    {
        $movies = [
            [
                'title' => 'The Matrix',
                'description' => 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
                'genre' => 'Sci-Fi',
                'duration' => 136,
                'release_date' => '1999-03-31',
                'poster_url' => '/images/movie_matrix.webp',
            ],
            [
                'title' => 'Inception',
                'description' => 'A skilled thief leads a team into people\'s dreams to steal or plant information.',
                'genre' => 'Sci-Fi',
                'duration' => 148,
                'release_date' => '2010-07-16',
                'poster_url' => '/images/movie_inception.webp',
            ],
            [
                'title' => 'The Godfather',
                'description' => 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
                'genre' => 'Crime',
                'duration' => 175,
                'release_date' => '1972-03-24',
                'poster_url' => '/images/movie_godfather.webp',
            ],
            [
                'title' => 'Interstellar',
                'description' => 'A team of explorers travel through a wormhole in space to ensure humanity\'s survival.',
                'genre' => 'Sci-Fi',
                'duration' => 169,
                'release_date' => '2014-11-07',
                'poster_url' => '/images/movie_interstellar.webp',
            ],
            [
                'title' => 'The Dark Knight',
                'description' => 'Batman sets out to dismantle the remaining criminal organizations that plague Gotham.',
                'genre' => 'Action',
                'duration' => 152,
                'release_date' => '2008-07-18',
                'poster_url' => '/images/movie_dark_knight.webp',
            ],
            [
                'title' => 'Avatar',
                'description' => 'Epic science fiction film set on the alien world of Pandora.',
                'genre' => 'Sci-Fi',
                'duration' => 162,
                'release_date' => '2009-12-18',
                'poster_url' => '/images/movie_avatar.webp',
            ],
            [
                'title' => 'Gladiator',
                'description' => 'Roman general seeks revenge after betrayal and the murder of his family.',
                'genre' => 'Action',
                'duration' => 155,
                'release_date' => '2000-05-05',
                'poster_url' => '/images/movie_gladiator.webp',
            ],
            [
                'title' => 'Forrest Gump',
                'description' => 'The life journey of a slow-witted but kind-hearted man from Alabama.',
                'genre' => 'Drama',
                'duration' => 142,
                'release_date' => '1994-07-06',
                'poster_url' => '/images/movie_forrest_gump.webp',
            ],
            [
                'title' => 'The Shawshank Redemption',
                'description' => 'Two imprisoned men bond over years and find solace and eventual redemption.',
                'genre' => 'Drama',
                'duration' => 142,
                'release_date' => '1994-09-23',
                'poster_url' => '/images/movie_shawshank_redemption.webp',
            ],
            [
                'title' => 'Pulp Fiction',
                'description' => 'A darkly comedic intertwining of crime stories in Los Angeles.',
                'genre' => 'Crime',
                'duration' => 154,
                'release_date' => '1994-10-14',
                'poster_url' => '/images/movie_pulp_fiction.webp',
            ],
            [
                'title' => 'Fight Club',
                'description' => 'An insomniac office worker and a soap maker form an underground fight club.',
                'genre' => 'Drama',
                'duration' => 139,
                'release_date' => '1999-10-15',
                'poster_url' => '/images/movie_fight_club.webp',
            ],
            [
                'title' => 'Titanic',
                'description' => 'A love story that unfolds on the ill-fated Titanic voyage.',
                'genre' => 'Romance',
                'duration' => 195,
                'release_date' => '1997-12-19',
                'poster_url' => '/images/movie_titanic.webp',
            ],
            [
                'title' => 'The Lord of the Rings: The Fellowship of the Ring',
                'description' => 'A hobbit embarks on a journey to destroy the One Ring.',
                'genre' => 'Fantasy',
                'duration' => 178,
                'release_date' => '2001-12-19',
                'poster_url' => '/images/movie_the_lord_of_the_rings.webp',
            ],
            [
                'title' => 'The Avengers',
                'description' => 'Earth’s mightiest heroes must come together to stop an alien invasion.',
                'genre' => 'Action',
                'duration' => 143,
                'release_date' => '2012-05-04',
                'poster_url' => '/images/movie_avengers.webp',
            ],
            [
                'title' => 'Joker',
                'description' => 'The origin story of Gotham’s infamous villain, Arthur Fleck.',
                'genre' => 'Thriller',
                'duration' => 122,
                'release_date' => '2019-10-04',
                'poster_url' => '/images/movie_joker.webp',
            ]
        ];

        foreach ($movies as $movie) {
            Movie::updateOrCreate(
                ['title' => $movie['title']], // փնտրում է նույն title-ով
                $movie                        // եթե չկա՝ insert, եթե կա՝ update
            );
        }
    }
}
