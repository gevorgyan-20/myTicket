<?php

use App\Http\Controllers\MovieController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ConcertController;
use App\Http\Controllers\StandupController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\SeatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum', 'admin'])->get('/admin/user', function (Request $request) {
    return response()->json([
        'message' => 'Welcome, Admin!',
        'user' => $request->user()
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// movies
Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{movie}', [MovieController::class, 'show']);
// Admin-only routes (middleware 'auth:sanctum' + 'admin')
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/admin/movies', [MovieController::class, 'store']);
    Route::get('/admin/movies/{movie}/edit', [MovieController::class, 'edit']);
    Route::delete('/admin/movies/{movie}', [MovieController::class, 'destroy']); 
});

// seats
// 1. Նստատեղերի Ցուցակը Ֆիլմի համար: Օրինակ՝ /api/movies/1/seats
Route::get('/movies/{movies}/seats', [SeatController::class, 'index']);

// 2. Նստատեղերի Ցուցակը Համերգի համար: Օրինակ՝ /api/concerts/5/seats
Route::get('/concerts/{concerts}/seats', [SeatController::class, 'index']);

// 3. Նստատեղերի Ցուցակը Սթենդափի համար: Օրինակ՝ /api/standups/2/seats
Route::get('/standups/{standups}/seats', [SeatController::class, 'index']);

// register, login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// concerts
Route::get('/concerts', [ConcertController::class, 'index']);
Route::get('/concerts/{concert}', [ConcertController::class, 'show']);
// Admin routes (auth:sanctum + admin middleware)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/admin/concerts', [ConcertController::class, 'store']);
    Route::get('/admin/concerts/{concert}/edit', [ConcertController::class, 'edit']);
    Route::delete('/admin/concerts/{concert}', [ConcertController::class, 'destroy']);
});

// standups
Route::get('/standups', [StandupController::class, 'index']);
Route::get('/standups/{standup}', [StandupController::class, 'show']);
// Admin routes (auth:sanctum + admin middleware)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/admin/standups', [StandupController::class, 'store']);
    Route::get('/admin/standups/{standup}/edit', [StandupController::class, 'edit']);
    Route::delete('/admin/standups/{standup}', [StandupController::class, 'destroy']);
});

// tickets
Route::get('tickets', [TicketController::class, 'index']);      

Route::get('tickets/{ticket}', [TicketController::class, 'show']);    

Route::post('tickets', [TicketController::class, 'store']);     

Route::delete('tickets/{ticket}', [TicketController::class, 'destroy']); 

Route::get('/venues', [VenueController::class, 'index']);
Route::get('/venues/{venue}', [VenueController::class, 'show']);
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/admin/venues', [VenueController::class, 'store']);
    Route::put('/admin/venues/{venue}', [VenueController::class, 'update']);
    Route::delete('/admin/venues/{venue}', [VenueController::class, 'destroy']);
});
