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
            'address'  => 'nullable|string|max:255',
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
            'address'  => 'nullable|string|max:255',
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
        $venue->delete();

        return response()->json([
            'message' => 'Venue deleted successfully!'
        ]);
    }
}
