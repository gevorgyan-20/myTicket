<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    // GET /api/movies
    public function index(Request $request)
    { 
        $query = Movie::query();

        // 1. Filter by Location (Where)
        if ($request->filled('venue_id')) {
            $query->whereHas('showtimes', function($q) use ($request) {
                $q->where('venue_id', $request->venue_id);
            });
        } elseif ($request->filled('where') && $request->where !== 'all') {
            $where = $request->where;
            $query->whereHas('showtimes.venue', function($q) use ($where) {
                $q->where('name', 'like', "%$where%")
                  ->orWhere('city', 'like', "%$where%");
            });
        }

        // 2. Filter by Date (When)
        if ($request->filled('when') && $request->when !== 'all') {
            $when = $request->when;
            $query->whereHas('showtimes', function($q) use ($when) {
                if ($when === 'today') {
                    $q->whereDate('start_time', now()->toDateString());
                } elseif ($when === 'tomorrow') {
                    $q->whereDate('start_time', now()->addDay()->toDateString());
                } elseif ($when === 'weekend') {
                    // Assuming weekend is Saturday and Sunday
                    $q->whereBetween('start_time', [now()->startOfWeek()->addDays(5), now()->startOfWeek()->addDays(6)]);
                } elseif ($when === 'month') {
                    $q->whereMonth('start_time', now()->month)
                      ->whereYear('start_time', now()->year);
                }
            });
        }

        // 3. Filter by Price (Only check section prices)
        if ($request->filled('price_min') || $request->filled('price_max')) {
            $query->whereHas('showtimes.sectionPrices', function($sq) use ($request) {
                if ($request->filled('price_min')) {
                    $sq->where('price', '>=', $request->price_min);
                }
                if ($request->filled('price_max')) {
                    $sq->where('price', '<=', $request->price_max);
                }
            });
        }

        $movies = $query->with(['showtimes' => function($q) {
            $q->orderBy('start_time');
        }, 'showtimes.venue', 'showtimes.sectionPrices'])->get();

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
            'poster'       => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'venue_id'     => 'nullable|exists:venues,id',
            'price'        => 'nullable|numeric|min:0',
            'allow_standing' => 'nullable|boolean',
        ]);

        if ($request->has('allow_standing')) {
            $validated['allow_standing'] = filter_var($request->allow_standing, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster_url'] = '/storage/' . $path;
        }

        $movie = Movie::create($validated);

        return response()->json([
            'message' => 'Movie created successfully!',
            'movie'   => $movie
        ], 201);
    }

    public function update(Request $request, Movie $movie)
    {
        $validated = $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'description'  => 'nullable|string',
            'genre'        => 'nullable|string|max:100',
            'duration'     => 'sometimes|required|integer',
            'release_date' => 'nullable|date',
            'poster'       => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'venue_id'     => 'nullable|exists:venues,id',
            'price'        => 'nullable|numeric|min:0',
            'allow_standing' => 'nullable|boolean',
        ]);

        if ($request->has('allow_standing')) {
            $validated['allow_standing'] = filter_var($request->allow_standing, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('poster')) {
            // Delete old poster if exists
            if ($movie->poster_url) {
                $oldPath = str_replace('/storage/', '', $movie->poster_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('poster')->store('posters', 'public');
            $movie->poster_url = '/storage/' . $path;
        } elseif ($request->input('remove_poster') === 'true') {
            // Explicitly remove poster without uploading new one
            if ($movie->poster_url) {
                $oldPath = str_replace('/storage/', '', $movie->poster_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
                $movie->poster_url = null;
            }
        }

        $movie->fill($validated);
        $movie->save();

        return response()->json([
            'message' => 'Movie updated successfully!',
            'movie'   => $movie
        ]);
    }

    // GET /admin/movies/{movie}/edit
    public function edit(Movie $movie)
    {
        return response()->json($movie);
    }

    // DELETE /admin/movies/{movie}
    public function destroy(Movie $movie)
    {
        if ($movie->poster_url) {
            $path = str_replace('/storage/', '', $movie->poster_url);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
        }
        $movie->delete();

        return response()->json([
            'message' => 'Movie deleted successfully!'
        ]);
    }
}

