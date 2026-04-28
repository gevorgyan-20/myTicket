<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Events\SeatLocked;
use App\Events\SeatUnlocked;

class SeatBroadcastingController extends Controller
{
    public function lock(Request $request)
    {
        $request->validate([
            'eventType' => 'required|string',
            'eventId' => 'required|integer',
            'seatId' => 'required|string',
        ]);

        broadcast(new SeatLocked(
            $request->eventType,
            $request->eventId,
            $request->seatId,
            auth()->id() ?? 'guest'
        ))->toOthers();

        return response()->json(['status' => 'Seat locked broadcasted']);
    }

    public function unlock(Request $request)
    {
        $request->validate([
            'eventType' => 'required|string',
            'eventId' => 'required|integer',
            'seatId' => 'required|string',
        ]);

        broadcast(new SeatUnlocked(
            $request->eventType,
            $request->eventId,
            $request->seatId
        ))->toOthers();

        return response()->json(['status' => 'Seat unlocked broadcasted']);
    }
}
