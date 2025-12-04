<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Seat; // <<-- ԱՎԵԼԱՑՎԱԾ Է (ԿԱՐԵՎՈՐ Է 500 ՍԽԱԼԸ ԼՈՒԾԵԼՈՒ ՀԱՄԱՐ)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    /**
     * Ստանում է միայն ներկայիս լոգին արած օգտատիրոջ տոմսերը։
     */
    public function index()
    {
        return Ticket::where('user_id', Auth::id())
                     ->with('seat', 'ticketable')
                     ->get();
    }

    /**
     * Ցույց է տալիս կոնկրետ տոմսը, եթե այն պատկանում է user-ին։
     */
    public function show($id)
    {
        return Ticket::where('user_id', Auth::id())
                     ->with('seat', 'ticketable')
                     ->findOrFail($id);
    }

    /**
     * Նոր տոմս է ստեղծում և ավտոմատ կցում է user-ի ID-ն։
     * ԿԱՐԵՎՈՐ ՈՒՂՂՈՒՄ: Թարմացնում է նաև նստատեղի կարգավիճակը։
     */
    public function store(Request $request)
    {
        // 1. Վալիդացիա
        $validated = $request->validate([
            'ticketable_id' => 'required|integer',
            'ticketable_type' => 'required|string',
            'seat_id' => 'required|exists:seats,id',
            'buyer_name' => 'nullable|string',
            'buyer_email' => 'nullable|email',
            'price' => 'required|numeric',
            'status' => 'in:reserved,purchased',
        ]);

        // 2. Ավելացնում ենք ներկայիս օգտատիրոջ ID-ն
        $validated['user_id'] = Auth::id();

        // 3. Ստուգում ենք՝ արդյոք նստատեղը հասանելի է
        $seat = Seat::where('id', $validated['seat_id'])->where('status', 'available')->first();

        if (!$seat) {
            return response()->json(['message' => 'The selected seat is already reserved.'], 409);
        }

        // 4. Ստեղծում ենք տոմսը
        $ticket = Ticket::create($validated);
        
        // 5. ՈՒՂՂՈՒՄ: Թարմացնում ենք նստատեղի կարգավիճակը
        $seat->status = 'reserved';
        $seat->save();

        return response()->json($ticket, 201);
    }

    /**
     * Ջնջում է տոմսը, եթե այն պատկանում է user-ին։
     */
    public function destroy($id)
    {
        // Ստուգում ենք, որ տոմսը պատկանում է user-ին նախքան ջնջելը
        $ticket = Ticket::where('user_id', Auth::id())->findOrFail($id);
        
        // ԿԱՐԵՎՈՐ: Նախքան տոմսը ջնջելը, նստատեղը պետք է դարձնենք 'available'
        if ($ticket->seat) {
            $ticket->seat->status = 'available';
            $ticket->seat->save();
        }
        
        $ticket->delete();

        return response()->json(null, 204); 
    }
}