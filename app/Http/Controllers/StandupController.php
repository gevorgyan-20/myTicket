<?php

namespace App\Http\Controllers;

use App\Models\Standup;
use Illuminate\Http\Request;

class StandupController extends Controller
{
    public function index()
    {
        $standups = Standup::all();
        return response()->json($standups);
    }

    public function show(Standup $standup)
    {
        // return $standup->load('seats', 'tickets');
        return response()->json($standup);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'performer' => 'required|string|max:255',
            'description' => 'nullable|string',
            'venue_id'    => 'nullable|exists:venues,id',
        ]);

        $standup = Standup::create($validated);

        return response()->json([
            'message' => 'Standup created successfully!',
            'standup' => $standup
        ], 201);
    }

    public function edit(Standup $standup)
    {
        return response()->json($standup);
    }

    public function destroy(Standup $standup)
    {
        $standup->delete();

        return response()->json([
            'message' => 'Standup deleted successfully!'
        ]);
    }
}
