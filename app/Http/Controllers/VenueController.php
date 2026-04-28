<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    // GET /api/venues  (optional ?type=theatre or ?type=stadium)
    public function index(Request $request)
    {
        $query = Venue::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->orderBy('name')->get());
    }

    // GET /api/venues/{venue}
    public function show(Venue $venue)
    {
        return response()->json($venue);
    }

    // POST /api/admin/venues
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'type'     => 'required|in:theatre,stadium',
            'address'  => 'required|string|max:255',
            'capacity' => 'nullable|integer|min:1',
        ]);

        $venue = Venue::create($validated);

        return response()->json([
            'message' => 'Venue created successfully!',
            'venue'   => $venue
        ], 201);
    }

    // PUT /api/admin/venues/{venue}
    public function update(Request $request, Venue $venue)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'type'     => 'required|in:theatre,stadium',
            'address'  => 'required|string|max:255',
            'capacity' => 'nullable|integer|min:1',
        ]);

        $venue->update($validated);

        return response()->json([
            'message' => 'Venue updated successfully!',
            'venue'   => $venue
        ]);
    }

    // DELETE /api/admin/venues/{venue}
    public function destroy(Venue $venue)
    {
        // ISSUE 5: Check for active (non-finished) events before deleting
        $activeShowtimeCount = $venue->showtimes()
            ->where(function ($q) {
                $q->where('end_time', '>', now())
                  ->orWhere(function ($q2) {
                      $q2->whereNull('end_time')
                         ->where('start_time', '>', now());
                  });
            })
            ->count();

        if ($activeShowtimeCount > 0) {
            return response()->json([
                'message' => "Cannot delete this venue — there are {$activeShowtimeCount} active event(s) still assigned to it. Please cancel or reassign them first.",
            ], 409);
        }

        $venue->delete();

        return response()->json([
            'message' => 'Venue deleted successfully!'
        ]);
    }
}
