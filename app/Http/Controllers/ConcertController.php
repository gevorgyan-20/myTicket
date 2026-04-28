<?php

namespace App\Http\Controllers;

use App\Models\Concert;
use Illuminate\Http\Request;

class ConcertController extends Controller
{
    public function index(Request $request)
    {
        $query = Concert::query();

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

        if ($request->filled('when') && $request->when !== 'all') {
            $when = $request->when;
            $query->whereHas('showtimes', function($q) use ($when) {
                if ($when === 'today') {
                    $q->whereDate('start_time', now()->toDateString());
                } elseif ($when === 'tomorrow') {
                    $q->whereDate('start_time', now()->addDay()->toDateString());
                } elseif ($when === 'weekend') {
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

        $concerts = $query->with(['showtimes' => function($q) {
            $q->orderBy('start_time');
        }, 'showtimes.venue', 'showtimes.sectionPrices'])->get();

        return response()->json($concerts);
    }

    public function show(Concert $concert)
    {
        // return $concert->load('seats', 'tickets');
        return response()->json($concert);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'performer'   => 'required|string|max:255',
            'start_time'  => 'required|date',
            'location'    => 'required|string|max:255',
            'poster'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'venue_id'    => 'nullable|exists:venues,id',
            'price'       => 'nullable|numeric|min:0',
            'allow_standing' => 'nullable|boolean',
        ]);

        if ($request->has('allow_standing')) {
            $validated['allow_standing'] = filter_var($request->allow_standing, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster_url'] = '/storage/' . $path;
        }

        $concert = Concert::create($validated);

        return response()->json([
            'message' => 'Concert created successfully!',
            'concert' => $concert
        ], 201);
    }

    public function update(Request $request, Concert $concert)
    {
        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'performer'   => 'sometimes|required|string|max:255',
            'start_time'  => 'sometimes|required|date',
            'location'    => 'sometimes|required|string|max:255',
            'poster'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'venue_id'    => 'nullable|exists:venues,id',
            'price'       => 'nullable|numeric|min:0',
            'allow_standing' => 'nullable|boolean',
        ]);

        if ($request->has('allow_standing')) {
            $validated['allow_standing'] = filter_var($request->allow_standing, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('poster')) {
            if ($concert->poster_url) {
                $oldPath = str_replace('/storage/', '', $concert->poster_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('poster')->store('posters', 'public');
            $concert->poster_url = '/storage/' . $path;
        } elseif ($request->input('remove_poster') === 'true') {
            if ($concert->poster_url) {
                $oldPath = str_replace('/storage/', '', $concert->poster_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
                $concert->poster_url = null;
            }
        }
        
        $concert->fill($validated);
        $concert->save();

        return response()->json([
            'message' => 'Concert updated successfully!',
            'concert' => $concert
        ]);
    }

    public function edit(Concert $concert)
    {
        return response()->json($concert);
    }

    public function destroy(Concert $concert)
    {
        if ($concert->poster_url) {
            $path = str_replace('/storage/', '', $concert->poster_url);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
        }
        $concert->delete();

        return response()->json([
            'message' => 'Concert deleted successfully!'
        ]);
    }
}

