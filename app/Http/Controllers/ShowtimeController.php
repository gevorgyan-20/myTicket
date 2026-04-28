<?php

namespace App\Http\Controllers;

use App\Models\Showtime;
use App\Models\ShowtimeSectionPrice;
use App\Models\Venue;
use App\Models\VenueSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShowtimeController extends Controller
{
    /**
     * Display a listing of showtimes for a specific event.
     */
    public function index(Request $request)
    {
        $request->validate([
            'event_id'   => 'required',
            'event_type' => 'required|string',
        ]);

        $type = $request->event_type;
        $modelMap = [
            'movie'   => \App\Models\Movie::class,
            'concert' => \App\Models\Concert::class,
            'standup' => \App\Models\Standup::class,
        ];

        $className = $modelMap[strtolower($type)] ?? $type;
        $morphType = (new $className)->getMorphClass();

        $showtimes = Showtime::where('showtimeable_id', $request->event_id)
            ->where('showtimeable_type', $morphType)
            ->with(['venue', 'sectionPrices.venueSection'])
            ->orderBy('start_time')
            ->get();

        return response()->json($showtimes);
    }

    /**
     * Store a newly created showtime in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id'                          => 'required',
            'event_type'                        => 'required|string',
            'venue_id'                          => 'required|exists:venues,id',
            'start_time'                        => 'required|date',
            'end_time'                          => 'nullable|date|after:start_time',
            'price'                             => 'nullable|numeric|min:0',
            // Section prices — required; each venue section must have a price
            'section_prices'                    => 'required|array|min:1',
            'section_prices.*.venue_section_id' => 'required|exists:venue_sections,id',
            'section_prices.*.price'            => 'required|numeric|min:0',
        ]);

        $modelMap = [
            'movie'   => \App\Models\Movie::class,
            'concert' => \App\Models\Concert::class,
            'standup' => \App\Models\Standup::class,
        ];

        $className = $modelMap[strtolower($validated['event_type'])] ?? $validated['event_type'];
        $morphType = (new $className)->getMorphClass();

        $showtime = DB::transaction(function () use ($validated, $morphType) {
            $showtime = Showtime::create([
                'showtimeable_id'   => $validated['event_id'],
                'showtimeable_type' => $morphType,
                'venue_id'          => $validated['venue_id'],
                'start_time'        => $validated['start_time'],
                'end_time'          => $validated['end_time'] ?? null,
                'price'             => $validated['price'] ?? null,
            ]);

            // Save per-section prices
            foreach ($validated['section_prices'] as $sp) {
                ShowtimeSectionPrice::create([
                    'showtime_id'       => $showtime->id,
                    'venue_section_id'  => $sp['venue_section_id'],
                    'price'             => $sp['price'],
                ]);
            }

            return $showtime;
        });

        $this->generateSeats($showtime);

        return response()->json([
            'message'  => 'Showtime created successfully!',
            'showtime' => $showtime->load(['venue', 'sectionPrices.venueSection'])
        ], 201);
    }

    /**
     * Generate seats for a showtime based on venue type.
     */
    private function generateSeats(Showtime $showtime)
    {
        $venue = $showtime->venue;
        if (!$venue) return;

        if ($venue->id == 1 || $venue->type == 'theatre') {
            $this->seedDesign1($showtime);
        } elseif ($venue->id == 2 || $venue->type == 'stadium') {
            $this->seedDesign2($showtime);
        } else {
            $this->seedDesign3($showtime);
        }
    }

    private function seedDesign1($showtime)
    {
        for ($row = 1; $row <= 4; $row++) {
            for ($num = 1; $num <= 8; $num++) {
                $this->createSeat($showtime, $row, $num);
            }
        }
        for ($row = 5; $row <= 12; $row++) {
            for ($num = 1; $num <= 13; $num++) {
                $this->createSeat($showtime, $row, $num);
            }
        }
    }

    private function seedDesign2($showtime)
    {
        for ($row = 1; $row <= 15; $row++) {
            for ($num = 1; $num <= 20; $num++) {
                $this->createSeat($showtime, $row, $num);
            }
        }
    }

    private function seedDesign3($showtime)
    {
        for ($row = 1; $row <= 8; $row++) {
            for ($num = 1; $num <= 10; $num++) {
                $this->createSeat($showtime, $row, $num);
            }
        }
    }

    private function createSeat($showtime, $row, $num)
    {
        \App\Models\Seat::create([
            'showtime_id' => $showtime->id,
            'row'         => $row,
            'number'      => $num,
            'status'      => 'available',
        ]);
    }

    /**
     * Display the specified showtime.
     */
    public function show(Showtime $showtime)
    {
        return response()->json(
            $showtime->load(['venue', 'showtimeable', 'sectionPrices.venueSection'])
        );
    }

    /**
     * Update the specified showtime in storage.
     */
    public function update(Request $request, Showtime $showtime)
    {
        $validated = $request->validate([
            'venue_id'                          => 'sometimes|required|exists:venues,id',
            'start_time'                        => 'sometimes|required|date',
            'end_time'                          => 'nullable|date|after:start_time',
            'price'                             => 'nullable|numeric|min:0',
            'section_prices'                    => 'sometimes|array|min:1',
            'section_prices.*.venue_section_id' => 'required_with:section_prices|exists:venue_sections,id',
            'section_prices.*.price'            => 'required_with:section_prices|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $showtime) {
            $showtime->update(\Illuminate\Support\Arr::except($validated, ['section_prices']));

            if (isset($validated['section_prices'])) {
                // Upsert pricing — delete old, insert new
                $showtime->sectionPrices()->delete();
                foreach ($validated['section_prices'] as $sp) {
                    ShowtimeSectionPrice::create([
                        'showtime_id'      => $showtime->id,
                        'venue_section_id' => $sp['venue_section_id'],
                        'price'            => $sp['price'],
                    ]);
                }
            }
        });

        return response()->json([
            'message'  => 'Showtime updated successfully!',
            'showtime' => $showtime->fresh()->load(['venue', 'sectionPrices.venueSection'])
        ]);
    }

    /**
     * Remove the specified showtime from storage.
     */
    public function destroy(Showtime $showtime)
    {
        $showtime->delete();

        return response()->json([
            'message' => 'Showtime deleted successfully!'
        ]);
    }

    /**
     * Return section prices for a specific showtime (public, for seat picker).
     */
    public function sectionPrices(Showtime $showtime)
    {
        return response()->json(
            $showtime->sectionPrices()->with('venueSection')->get()
                ->map(fn($sp) => [
                    'venue_section_id' => $sp->venue_section_id,
                    'label'            => $sp->venueSection?->label,
                    'color'            => $sp->venueSection?->color,
                    'price'            => (float) $sp->price,
                ])
        );
    }
}
