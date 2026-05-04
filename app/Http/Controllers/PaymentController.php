<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Refund;

class PaymentController extends Controller
{
    /**
     * Create a PaymentIntent and return the client_secret to the frontend.
     */
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'amount'   => 'required|integer|min:1',
            'currency' => 'required|string|size:3',
            'metadata' => 'nullable|array',
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        $intent = PaymentIntent::create([
            'amount'   => (int) round($request->amount * 100), // Stripe requires amount in smallest currency unit.(AMD: 1 AMD = 100 lumas, so multiply by 100.)
            'currency' => strtolower($request->currency),
            'metadata' => array_merge(
                ['user_id' => Auth::id()],
                $request->metadata ?? []
            ),
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        return response()->json([
            'client_secret'        => $intent->client_secret,
            'payment_intent_id'    => $intent->id,
        ]);
    }

    /**
     * Save a transaction record after successful payment (called from frontend).
     */
    public function storeTransaction(Request $request)
    {
        $request->validate([
            'stripe_payment_intent_id' => 'required|string',
            'amount'                   => 'required|numeric|min:0',
            'currency'                 => 'required|string|size:3',
            'metadata'                 => 'nullable|array',
            'ticket_ids'               => 'nullable|array',
            'ticket_ids.*'             => 'integer',
        ]);

        // Prevent duplicate transactions
        $existing = Transaction::where('stripe_payment_intent_id', $request->stripe_payment_intent_id)->first();
        if ($existing) {
            return response()->json($existing, 200);
        }

        $transaction = Transaction::create([
            'user_id'                  => Auth::id(),
            'stripe_payment_intent_id' => $request->stripe_payment_intent_id,
            'amount'                   => $request->amount,
            'currency'                 => strtolower($request->currency),
            'status'                   => 'paid',
            'metadata'                 => $request->metadata,
        ]);

        // Link tickets to this payment intent
        if ($request->ticket_ids) {
            Ticket::whereIn('id', $request->ticket_ids)
                  ->where('user_id', Auth::id())
                  ->update(['stripe_payment_intent_id' => $request->stripe_payment_intent_id]);

            // Send tickets via email
            $tickets = Ticket::whereIn('id', $request->ticket_ids)
                ->with(['showtime.showtimeable', 'showtime.venue', 'seat', 'venueSeat'])
                ->get();

            if ($tickets->isNotEmpty()) {
                    \Illuminate\Support\Facades\Mail::to(Auth::user()->email)
                        ->send(new \App\Mail\TicketMail(Auth::user(), $tickets));
            }
        }

        return response()->json($transaction, 201);
    }

    /**
     * Return the current user's transactions (newest first).
     */
    public function getUserTransactions()
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();

        return response()->json($transactions);
    }

    /**
     * Refund selected tickets and update statuses.
     */
    public function refund(Request $request)
    {
        $request->validate([
            'stripe_payment_intent_id' => 'required|string',
            'ticket_ids'               => 'required|array|min:1',
            'ticket_ids.*'             => 'integer',
            'refund_amount'            => 'required|numeric|min:1',
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        // Retrieve the PaymentIntent to get the charge id
        $intent = PaymentIntent::retrieve($request->stripe_payment_intent_id);
        $chargeId = $intent->latest_charge ?? null;

        if (!$chargeId) {
            return response()->json(['message' => 'No charge found for this payment.'], 422);
        }

        // Process the Stripe refund (amount in lumas)
        Refund::create([
            'charge' => $chargeId,
            'amount' => (int) round($request->refund_amount * 100),
        ]);

        // Mark selected tickets as refunded
        $refundedTickets = Ticket::whereIn('id', $request->ticket_ids)
            ->where('user_id', Auth::id())
            ->get();

        $updatedCount = 0;
        foreach ($refundedTickets as $ticket) {
            $ticket->update(['status' => 'refunded']);
            $updatedCount++;

            // For legacy static seats: reset the seat status back to 'available'
            // so the seat can be purchased again.
            // Spatial seats don't need this — SeatController counts only 'buy' tickets.
            if ($ticket->seat_id) {
                $seat = \App\Models\Seat::find($ticket->seat_id);
                if ($seat && isset($seat->status)) {
                    $seat->update(['status' => 'available']);
                }
            }
        }


        // Check if all tickets for this intent are now refunded
        $totalTickets    = Ticket::where('stripe_payment_intent_id', $request->stripe_payment_intent_id)
                                  ->where('user_id', Auth::id())
                                  ->count();
        $refundedTickets = Ticket::where('stripe_payment_intent_id', $request->stripe_payment_intent_id)
                                  ->where('user_id', Auth::id())
                                  ->where('status', 'refunded')
                                  ->count();

        $newTransactionStatus = ($refundedTickets >= $totalTickets) ? 'refunded' : 'partial_refund';

        Transaction::where('stripe_payment_intent_id', $request->stripe_payment_intent_id)
            ->where('user_id', Auth::id())
            ->update(['status' => $newTransactionStatus]);

        return response()->json([
            'message'       => 'Refund processed successfully.',
            'tickets_updated' => $updatedCount,
        ]);
    }
}
