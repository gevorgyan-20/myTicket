<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $feedback = Feedback::create([
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'user_id' => auth()->id(),
        ]);

        return response()->json(['message' => 'Feedback submitted successfully.', 'feedback' => $feedback], 201);
    }
}
