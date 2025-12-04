<?php

namespace App\Http\Controllers;

use App\Models\Concert;
use Illuminate\Http\Request;

class ConcertController extends Controller
{
    public function index()
    {
        $concerts = Concert::all();
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
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'genre'        => 'nullable|string|max:100',
            'duration'     => 'required|integer',
            'release_date' => 'nullable|date',
            'poster_url'   => 'nullable|string|max:255',
        ]);

        $concert = Concert::create($validated);

        return response()->json([
            'message' => 'Concert created successfully!',
            'concert' => $concert
        ], 201);
    }

    public function edit(Concert $concert)
    {
        return response()->json($concert);
    }

    public function destroy(Concert $concert)
    {
        $concert->delete();

        return response()->json([
            'message' => 'Concert deleted successfully!'
        ]);
    }
}
