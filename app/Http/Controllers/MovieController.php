<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    // GET /api/movies
    public function index()
    { 
        $movies = Movie::all();
        return response()->json($movies);
    }

    // GET /api/movies/{movie}
    public function show(Movie $movie)
    {
        return response()->json($movie);
    }

    // for ADMIN role
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'genre'        => 'nullable|string|max:100',
            'duration'     => 'required|integer',
            'release_date' => 'nullable|date',
            'poster_url'   => 'nullable|string|max:255',
            'venue_id'     => 'nullable|exists:venues,id',
        ]);

        $movie = Movie::create($validated);

        return response()->json([
            'message' => 'Movie created successfully!',
            'movie'   => $movie
        ], 201);
    }

    // GET /admin/movies/{movie}/edit
    public function edit(Movie $movie)
    {
        return response()->json($movie);
    }

    // DELETE /admin/movies/{movie}
    public function destroy(Movie $movie)
    {
        $movie->delete();

        return response()->json([
            'message' => 'Movie deleted successfully!'
        ]);
    }

}
