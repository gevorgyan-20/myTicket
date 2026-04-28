<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Seat;
use App\Models\Showtime;
use App\Models\VenueSeat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TicketController extends Controller
{
    /**
     * Returns only the currently logged-in user's tickets.
     */
    public function index()
    {
        // Lazily expire any timed-out reservations for this user
        $this->releaseExpiredReservations();

        return Ticket::where('user_id', Auth::id())
                     ->with('seat', 'showtime.showtimeable')
                     ->get();
    }

    public function show($id)
    {
        return Ticket::where('user_id', Auth::id())
                     ->with('seat', 'showtime.showtimeable')
                     ->findOrFail($id);
    }

    /**
     * Create or confirm a ticket.
     *
     * action = 'reserve'  → create a 10-min hold (status: reserved)
     * action = 'buy'      → upgrade an existing reservation to 'buy'
     *                        or create a direct 'buy' ticket (legacy path)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'showtime_id' => 'required|exists:showtimes,id',
            'seat_id'     => 'required|integer',
            'buyer_name'  => 'nullable|string',
            'buyer_email' => 'nullable|email',
            'price'       => 'required|numeric',
            'status'      => 'in:reserved,purchased,buy',
            'action'      => 'nullable|in:reserve,buy',
        ]);

        $validated['user_id'] = Auth::id();
        $action = $request->input('action', 'buy');

        // Lazily clean up any expired reservations so they don't block new purchases
        $this->releaseExpiredReservations();

        // Enforce maximum 5 tickets per user per showtime
        $userBoughtCount = Ticket::where('user_id', Auth::id())
            ->where('showtime_id', $validated['showtime_id'])
            ->whereIn('status', ['purchased', 'buy', 'reserved'])
            ->count();

        // Check if this is an upgrade of an existing reservation
        $isUpgrade = false;
        if ($action === 'buy') {
            $isUpgrade = Ticket::where('user_id', Auth::id())
                ->where('showtime_id', $validated['showtime_id'])
                ->where('seat_id', $validated['seat_id'])
                ->where('status', 'reserved')
                ->where('reserved_until', '>', Carbon::now())
                ->exists();
        }

        // If it's not an upgrade, enforce the 5 ticket limit
        if (!$isUpgrade && $userBoughtCount >= 5) {
            return response()->json(['message' => 'You cannot buy more than 5 tickets for this session.'], 403);
        }

        $showtime = Showtime::with('venue')->findOrFail($validated['showtime_id']);
        $venue    = $showtime->venue;

        // ── SPATIAL LAYOUT LOGIC ──────────────────────────────────────────────
        if ($venue && $venue->layout_status === 'published') {

            $venueSeat = VenueSeat::where('id', $validated['seat_id'])
                                  ->where('venue_id', $venue->id)
                                  ->first();

            if (!$venueSeat) {
                return response()->json(['message' => 'Invalid seat for this venue.'], 404);
            }

            // Count only active (non-expired) reservations + paid tickets
            $bookedCount = Ticket::where('showtime_id', $validated['showtime_id'])
                ->where('seat_id', $validated['seat_id'])
                ->where(function ($q) {
                    $q->whereIn('status', ['buy', 'purchased'])
                      ->orWhere(function ($q2) {
                          $q2->where('status', 'reserved')
                             ->where('reserved_until', '>', Carbon::now());
                      });
                })
                ->count();

            $isStanding = $venueSeat->type === 'standing';
            $capacity   = $isStanding ? ($venueSeat->capacity ?? 100) : 1;

            if (!$isUpgrade && $bookedCount >= $capacity) {
                return response()->json(['message' => 'The selected seat is already reserved.'], 409);
            }

            if ($action === 'reserve') {
                // ── SEAT HOLD ──────────────────────────────────────────────
                $validated['status']         = 'reserved';
                $validated['reserved_until'] = Carbon::now()->addMinutes(10);
                $ticket = Ticket::create($validated);
                return response()->json($ticket, 201);

            } else {
                // ── BUYING (upgrade existing reservation if present) ────────
                $existing = Ticket::where('user_id', Auth::id())
                    ->where('showtime_id', $validated['showtime_id'])
                    ->where('seat_id', $validated['seat_id'])
                    ->where('status', 'reserved')
                    ->where('reserved_until', '>', Carbon::now())
                    ->first();

                if ($existing) {
                    $existing->update([
                        'status'        => 'buy',
                        'reserved_until' => null,
                        'buyer_name'    => $validated['buyer_name'] ?? $existing->buyer_name,
                        'buyer_email'   => $validated['buyer_email'] ?? $existing->buyer_email,
                    ]);
                    
                    $this->broadcastPurchase($showtime, $validated['seat_id']);
                    return response()->json($existing, 200);
                }

                // No reservation exists — create ticket directly
                $validated['status']         = 'buy';
                $validated['reserved_until'] = null;
                $ticket = Ticket::create($validated);
                
                $this->broadcastPurchase($showtime, $validated['seat_id']);
                return response()->json($ticket, 201);
            }

        // ── LEGACY / STATIC SEATS LOGIC ──────────────────────────────────────
        } else {
            $seat = Seat::where('id', $validated['seat_id'])
                        ->where('showtime_id', $validated['showtime_id'])
                        ->first();

            if (!$seat) {
                return response()->json(['message' => 'Invalid seat for this session.'], 404);
            }

            if (!$isUpgrade && $seat->status !== 'available') {
                return response()->json(['message' => 'The selected seat is already reserved or invalid for this session.'], 409);
            }

            if ($action === 'reserve') {
                $validated['status']         = 'reserved';
                $validated['reserved_until'] = Carbon::now()->addMinutes(10);
                $ticket = Ticket::create($validated);
                $seat->status = 'reserved';
                $seat->save();
                return response()->json($ticket, 201);
            }

            // BUYING
            if ($isUpgrade) {
                $existing = Ticket::where('user_id', Auth::id())
                    ->where('showtime_id', $validated['showtime_id'])
                    ->where('seat_id', $validated['seat_id'])
                    ->where('status', 'reserved')
                    ->where('reserved_until', '>', Carbon::now())
                    ->first();

                if ($existing) {
                    $existing->update([
                        'status'        => 'buy',
                        'reserved_until' => null,
                        'buyer_name'    => $validated['buyer_name'] ?? $existing->buyer_name,
                        'buyer_email'   => $validated['buyer_email'] ?? $existing->buyer_email,
                    ]);
                    $seat->status = 'reserved';
                    $seat->save();
                    
                    $this->broadcastPurchase($showtime, $validated['seat_id']);
                    return response()->json($existing, 200);
                }
            }

            // Direct buy
            $validated['status']         = 'buy';
            $validated['reserved_until'] = null;
            $ticket = Ticket::create($validated);
            $seat->status = 'reserved';
            $seat->save();
            
            $this->broadcastPurchase($showtime, $validated['seat_id']);
            return response()->json($ticket, 201);
        }
    }

    /**
     * Helper to broadcast a purchase.
     */
    private function broadcastPurchase($showtime, $seatId): void
    {
        $type = strtolower(class_basename($showtime->showtimeable_type));
        if ($type === 'movie') $type = 'movies';
        if ($type === 'concert') $type = 'concerts';
        if ($type === 'standup') $type = 'standups';

        broadcast(new \App\Events\SeatPurchased($type, $showtime->showtimeable_id, $seatId))->toOthers();
    }

    /**
     * Delete the ticket.
     */
    public function destroy($id)
    {
        $ticket = Ticket::where('user_id', Auth::id())->findOrFail($id);

        if ($ticket->seat) {
            $ticket->seat->status = 'available';
            $ticket->seat->save();
        }

        $ticket->delete();
    }

    public function getUserTicketCount($showtimeId)
    {
        $count = Ticket::where('user_id', Auth::id())
            ->where('showtime_id', $showtimeId)
            ->whereIn('status', ['purchased', 'buy', 'reserved'])
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Explicitly cancel a reservation for the authenticated user.
     */
    public function cancel(Request $request)
    {
        $request->validate([
            'ticket_ids' => 'required|array',
            'ticket_ids.*' => 'integer',
        ]);

        $tickets = Ticket::where('user_id', Auth::id())
            ->whereIn('id', $request->ticket_ids)
            ->where('status', 'reserved')
            ->get();

        foreach ($tickets as $ticket) {
            $this->releaseTicket($ticket);
        }

        return response()->json(['message' => 'Reservations canceled.']);
    }

    /**
     * Release expired reservations back to 'available'.
     * Called lazily (no cron needed) on any ticket read/write.
     */
    private function releaseExpiredReservations(): void
    {
        $expired = Ticket::where('status', 'reserved')
            ->where('reserved_until', '<=', Carbon::now())
            ->get();

        foreach ($expired as $ticket) {
            $this->releaseTicket($ticket);
        }
    }

    /**
     * Helper to release a single ticket and broadcast the event.
     */
    private function releaseTicket(Ticket $ticket): void
    {
        $ticket->update(['status' => 'canceled', 'reserved_until' => null]);

        // Reset legacy seat if exists
        if ($ticket->seat_id) {
            $seat = Seat::find($ticket->seat_id);
            if ($seat && $seat->status === 'reserved') {
                $seat->update(['status' => 'available']);
            }
        }

        // Broadcast release to others via WebSocket
        // We need the showtimeable type for the channel name
        $showtime = Showtime::with('showtimeable')->find($ticket->showtime_id);
        if ($showtime) {
            $type = strtolower(class_basename($showtime->showtimeable_type));
            // pluralize type to match our frontend routes/channels
            if ($type === 'movie') $type = 'movies';
            if ($type === 'concert') $type = 'concerts';
            if ($type === 'standup') $type = 'standups';

            broadcast(new \App\Events\SeatUnlocked($type, $showtime->showtimeable_id, $ticket->seat_id))->toOthers();
        }
    }
}