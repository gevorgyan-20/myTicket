<?php

namespace App\Http\Controllers;

use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use App\Models\Movie;      // Փոխանցված մոդելներ
use App\Models\Concert;    // Փոխանցված մոդելներ
use App\Models\Standup;    // Փոխանցված մոդելներ
use Illuminate\Support\Facades\URL;
use Illuminate\Database\Eloquent\Relations\Relation; // Կարևոր է polymorphic mapping-ի համարZ

class SeatController extends Controller
{
    public function index(Request $request)
    {
        $seatableTypes = [
            'movies'   => \App\Models\Movie::class,
            'concerts' => \App\Models\Concert::class,
            'standups' => \App\Models\Standup::class,
        ];
        
        $seatable = null;
        foreach ($seatableTypes as $paramName => $modelClass) {
            $id = $request->route($paramName);
            if ($id) {
                $seatable = $modelClass::find($id);
                break;
            }
        }
        
        if (!$seatable) {
            return response()->json(['error' => 'Event not found.'], 404);
        }

        // Get the first showtime for this event if no showtime_id is provided
        // In a real app, the user would select a specific showtime
        $showtimeId = $request->query('showtime_id');
        
        if ($showtimeId) {
            $showtime = \App\Models\Showtime::find($showtimeId);
        } else {
            $showtime = $seatable->showtimes()->first();
        }

        if (!$showtime) {
            return response()->json([], 200);
        }
        
        $venue = $showtime->venue;

        // NEW: Check if venue has a custom spatial layout
        if ($venue && $venue->layout_status === 'published') {
            $event = $showtime->showtimeable;
            $allowStanding = $event->allow_standing ?? true;

            $venueSeats = \App\Models\VenueSeat::where('venue_id', $venue->id)->get();
            
            // Get sold ticket counts per seat for this showtime.
            // Only count paid ('buy'/'purchased') tickets and active (non-expired) reservations.
            $now = \Carbon\Carbon::now();
            $soldCounts = \App\Models\Ticket::where('showtime_id', $showtime->id)
                ->where(function ($q) use ($now) {
                    $q->whereIn('status', ['buy', 'purchased'])
                      ->orWhere(function ($q2) use ($now) {
                          $q2->where('status', 'reserved')
                             ->where('reserved_until', '>', $now);
                      });
                })
                ->select('seat_id', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
                ->groupBy('seat_id')
                ->pluck('total', 'seat_id')
                ->toArray();

            // Build per-section price map from this showtime's section prices
            $sectionPriceMap = \App\Models\ShowtimeSectionPrice::where('showtime_id', $showtime->id)
                ->get()
                ->keyBy('venue_section_id')
                ->map(fn($sp) => (float) $sp->price)
                ->toArray();

            $formattedSeats = $venueSeats->map(function($seat) use ($soldCounts, $sectionPriceMap, $allowStanding) {
                $sold = $soldCounts[$seat->id] ?? 0;
                $isStanding = $seat->type === 'standing';
                $capacity = $isStanding ? ($seat->capacity ?? 100) : 1;
                $available = max(0, $capacity - $sold);

                // Disable standing zones if not allowed for this event
                $isDisabled = $isStanding && !$allowStanding;

                return [
                    'id'            => $seat->id,
                    'row'           => $seat->section?->label ?? 'General',
                    'number'        => $seat->label,
                    'status'        => ($available > 0 && !$isDisabled) ? 'available' : 'reserved',
                    'type'          => $seat->type,
                    'available_qty' => $available,
                    'capacity'      => $capacity,
                    'is_spatial'    => true,
                    'venue_id'      => $seat->venue_id,
                    'section_price' => $sectionPriceMap[$seat->venue_section_id] ?? null,
                    'is_disabled'   => $isDisabled,
                ];
            });

            return response()->json($formattedSeats);
        }

        // LEGACY: fallback to static seats table
        $seats = Seat::where('showtime_id', $showtime->id)
                     ->orderBy('row')
                     ->orderBy('number')
                     ->get();

        return response()->json($seats);
    }
}