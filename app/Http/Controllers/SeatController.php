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
        // 1. Սահմանում ենք ճիշտ մոդելների դասերը
        $seatableTypes = [
            'movies' => Movie::class,
            'concerts' => Concert::class,
            'standups' => Standup::class,
        ];
        
        $seatable = null;

        // 2. Փնտրում ենք ակտիվ պարամետրը Route-ում
        foreach ($seatableTypes as $paramName => $modelClass) {
            $id = $request->route($paramName);
            
            if ($id) {
                // Եթե ID-ն գտնվել է (օրինակ՝ movies/1/seats), ապա գտնում ենք մոդելը
                $seatable = $modelClass::findOrFail($id);
                break; // Դուրս ենք գալիս ցիկլից, երբ գտնում ենք առաջինը
            }
        }
        
        // 3. Ստուգում ենք, որ մոդելը գտնվել է
        if (!$seatable) {
            return response()->json(['error' => 'Invalid event type or ID not found.'], 404);
        }

        // 4. Ստանում ենք Polymorphic կապի համար անհրաժեշտ տվյալները
        $seatableType = $seatable->getMorphClass(); 
        $seatableId = $seatable->id;
        
        // 5. Ֆիլտրում ենք նստատեղերը ըստ Polymorphic կապի
        $seats = Seat::where('seatable_type', $seatableType)
                     ->where('seatable_id', $seatableId)
                     ->orderBy('row')
                     ->orderBy('number')
                     ->get();

        // 6. Վերադարձնում ենք նստատեղերի ցուցակը
        return response()->json($seats);
    }
}