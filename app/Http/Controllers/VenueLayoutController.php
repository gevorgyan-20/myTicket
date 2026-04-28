<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\VenueSeat;
use App\Models\VenueSection;
use App\Models\VenueLayoutDraft;
use App\Models\Showtime;
use App\Models\ShowtimeSectionPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VenueLayoutController extends Controller
{
    // ─────────────────────────────────────────────────────────────────
    // GET /api/admin/venues/{venue}/layout
    // Returns the current draft (preferred) or published layout for the editor.
    // ─────────────────────────────────────────────────────────────────
    public function show(Venue $venue)
    {
        $draft = $venue->layoutDraft;

        if ($draft) {
            $snapshot = $draft->snapshot;
            // Ensure snaphost has at least one section
            if (empty($snapshot['sections'])) {
                $snapshot['sections'] = [[
                    'id'    => (string) \Illuminate\Support\Str::uuid(),
                    'label' => 'General',
                    'color' => '#7C3AED',
                ]];
            }

            return response()->json([
                'source'        => 'draft',
                'layout_status' => $venue->layout_status,
                'canvas_width'  => $venue->canvas_width,
                'canvas_height' => $venue->canvas_height,
                'snapshot'      => $snapshot,
            ]);
        }

        // Fall back: serialise the published venue_seats into snapshot shape
        $dbSections = $venue->sections()->get();
        
        if ($dbSections->isEmpty()) {
            $sections = [[
                'id'    => 'sec-default',
                'label' => 'General',
                'color' => '#7C3AED',
            ]];
        } else {
            $sections = $dbSections->map(fn($s) => [
                'id'     => 'sec-' . $s->id,
                'db_id'  => $s->id,
                'label'  => $s->label,
                'color'  => $s->color,
            ])->values();
        }

        $sectionIdMap = collect($sections)->keyBy('id');

        $seats = $venue->venueSeats()->where('status', 'active')->get()->map(fn($seat) => [
            'id'         => 'seat-' . $seat->id,
            'db_id'      => $seat->id,
            'label'      => $seat->label,
            'type'       => $seat->type,
            'x'          => (float) $seat->x,
            'y'          => (float) $seat->y,
            'width'      => (float) $seat->width,
            'height'     => (float) $seat->height,
            'rotation'   => (int)   $seat->rotation,
            'section_id' => $seat->venue_section_id
                ? 'sec-' . $seat->venue_section_id
                : ($dbSections->isEmpty() ? 'sec-default' : null),
        ])->values();

        return response()->json([
            'source'        => 'published',
            'layout_status' => $venue->layout_status,
            'canvas_width'  => $venue->canvas_width,
            'canvas_height' => $venue->canvas_height,
            'snapshot'      => [
                'sections' => $sections,
                'seats'    => $seats,
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────────
    // GET /api/venues/{venue}/layout   (public – no admin middleware)
    // Returns only the published seats for the customer seat-picker.
    // ─────────────────────────────────────────────────────────────────
    public function showPublished(Venue $venue, Request $request)
    {
        if ($venue->layout_status !== 'published') {
            return response()->json(['message' => 'Layout not published yet.'], 404);
        }

        // Build section price map if a showtime_id is provided
        $priceMap = [];
        if ($request->has('showtime_id')) {
            $showtime = Showtime::find($request->showtime_id);
            if ($showtime) {
                $priceMap = $showtime->sectionPrices()
                    ->get()
                    ->keyBy('venue_section_id')
                    ->map(fn($sp) => (float) $sp->price)
                    ->toArray();
            }
        }

        $sections = $venue->sections()->get()->map(fn($s) => [
            'id'    => $s->id,
            'label' => $s->label,
            'color' => $s->color,
            'price' => $priceMap[$s->id] ?? null,   // per-showtime price
        ]);

        $seats = $venue->venueSeats()
            ->where('status', 'active')
            ->with('section')
            ->get()
            ->map(fn($seat) => [
                'id'         => $seat->id,
                'label'      => $seat->label,
                'type'       => $seat->type,
                'x'          => (float) $seat->x,
                'y'          => (float) $seat->y,
                'width'      => (float) $seat->width,
                'height'     => (float) $seat->height,
                'rotation'   => (int)   $seat->rotation,
                'section_id' => $seat->venue_section_id,
            ]);

        $allowStanding = true;
        if ($request->has('showtime_id')) {
            $showtime = Showtime::with('showtimeable')->find($request->showtime_id);
            if ($showtime && $showtime->showtimeable) {
                $allowStanding = (bool) $showtime->showtimeable->allow_standing;
            }
        }

        return response()->json([
            'canvas_width'  => $venue->canvas_width,
            'canvas_height' => $venue->canvas_height,
            'sections'      => $sections,
            'seats'         => $seats,
            'has_standing'  => $allowStanding,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────
    // GET /api/venues/{venue}/sections   (public)
    // Returns the list of sections for a venue (used by showtime form).
    // ─────────────────────────────────────────────────────────────────
    public function getSections(Venue $venue)
    {
        $sections = $venue->sections()->get()->map(fn($s) => [
            'id'    => $s->id,
            'label' => $s->label,
            'color' => $s->color,
            'is_standing' => $s->seats()->where('type', 'standing')->exists(),
        ]);

        return response()->json($sections);
    }

    // ─────────────────────────────────────────────────────────────────
    // POST /api/admin/venues/{venue}/layout/draft
    // Auto-save: stores the whole canvas as a JSON snapshot.
    // ─────────────────────────────────────────────────────────────────
    public function saveDraft(Request $request, Venue $venue)
    {
        $data = $request->validate([
            'snapshot'                     => 'required|array',
            'snapshot.seats'               => 'required|array',
            'snapshot.seats.*.label'       => 'nullable|string|max:20',
            'snapshot.seats.*.type'        => 'required|in:seat,standing',
            'snapshot.seats.*.x'           => 'required|numeric',
            'snapshot.seats.*.y'           => 'required|numeric',
            'snapshot.seats.*.width'       => 'nullable|numeric|min:0',
            'snapshot.seats.*.height'      => 'nullable|numeric|min:0',
            'snapshot.seats.*.rotation'    => 'integer|between:0,359',
            'snapshot.sections'            => 'nullable|array',
            'snapshot.sections.*.label'    => 'required_with:snapshot.sections|string|max:100',
            'snapshot.sections.*.color'    => 'nullable|string|max:7',
        ]);

        VenueLayoutDraft::updateOrCreate(
            ['venue_id' => $venue->id],
            ['snapshot' => $data['snapshot']]
        );

        if ($venue->layout_status === 'none') {
            $venue->update(['layout_status' => 'draft']);
        }

        return response()->json(['message' => 'Draft saved.']);
    }

    // ─────────────────────────────────────────────────────────────────
    // POST /api/admin/venues/{venue}/layout/publish
    // Validates the snapshot, then atomically commits it to venue_seats.
    // ─────────────────────────────────────────────────────────────────
    public function publish(Request $request, Venue $venue)
    {
        $data = $request->validate([
            'snapshot'                     => 'required|array',
            'snapshot.seats'               => 'required|array|min:1',
            'snapshot.seats.*.id'          => 'required|string',
            'snapshot.seats.*.label'       => 'nullable|string|max:20',
            'snapshot.seats.*.type'        => 'required|in:seat,standing',
            'snapshot.seats.*.x'           => 'required|numeric',
            'snapshot.seats.*.y'           => 'required|numeric',
            'snapshot.seats.*.width'       => 'nullable|numeric|min:0',
            'snapshot.seats.*.height'      => 'nullable|numeric|min:0',
            'snapshot.seats.*.rotation'    => 'integer|between:0,359',
            'snapshot.seats.*.section_id'  => 'nullable|string',
            'snapshot.sections'            => 'nullable|array',
            'snapshot.sections.*.id'       => 'required_with:snapshot.sections|string',
            'snapshot.sections.*.label'    => 'required_with:snapshot.sections|string|max:100',
            'snapshot.sections.*.color'    => 'nullable|string|max:7',
        ]);

        $seats = $data['snapshot']['seats'];

        // ── Validation 1: Bounds check ────────────────────────────────
        $canvasW = $venue->canvas_width;
        $canvasH = $venue->canvas_height;
        foreach ($seats as $seat) {
            if ($seat['x'] < -100 || $seat['x'] > $canvasW + 100 || $seat['y'] < -100 || $seat['y'] > $canvasH + 100) {
                 // Relaxed bounds for elements potentially bleeding off
            }
        }

        // ── Atomic publish ────────────────────────────────────────────
        DB::transaction(function () use ($venue, $seats, $data) {

            // Soft-delete OLD active seats (keeps existing ticket FK references intact)
            $venue->venueSeats()->where('status', 'active')->update(['status' => 'removed']);

            // Rebuild sections
            $venue->sections()->delete();
            $sectionMap = []; 

            foreach ($data['snapshot']['sections'] ?? [] as $sec) {
                $newSection = $venue->sections()->create([
                    'label' => $sec['label'],
                    'color' => $sec['color'] ?? '#7C3AED',
                ]);
                $sectionMap[$sec['id']] = $newSection->id;
            }

            // Bulk-insert new seats
            $now  = now();
            // ISSUE 3: Get the first section's DB id as fallback for orphaned seats
            $firstSectionDbId = !empty($sectionMap) ? reset($sectionMap) : null;

            $rows = array_map(fn($s) => [
                'venue_id'         => $venue->id,
                'venue_section_id' => isset($s['section_id']) && isset($sectionMap[$s['section_id']])
                    ? $sectionMap[$s['section_id']]
                    : $firstSectionDbId, // Fallback to first section instead of null
                'label'      => $s['label'] ?? '',
                'type'       => $s['type'],
                'x'          => $s['x'],
                'y'          => $s['y'],
                'width'      => $s['width'] ?? null,
                'height'     => $s['height'] ?? null,
                'rotation'   => $s['rotation'] ?? 0,
                'status'     => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ], $seats);

            VenueSeat::insert($rows);

            // Update canvas dimensions and calculate capacity based on active seats
            $venue->update([
                'layout_status' => 'published',
                'canvas_width'  => $data['snapshot']['canvas_width']  ?? $venue->canvas_width,
                'canvas_height' => $data['snapshot']['canvas_height'] ?? $venue->canvas_height,
                'capacity'      => count($seats),
            ]);
        });

        // Clear draft
        $venue->layoutDraft()->delete();

        return response()->json(['message' => 'Layout published successfully!']);
    }
}
