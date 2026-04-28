<?php

use App\Http\Controllers\MovieController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ConcertController;
use App\Http\Controllers\StandupController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\VenueLayoutController;
use App\Http\Controllers\SeatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\ShowtimeController;
use App\Http\Controllers\SeatBroadcastingController;
use App\Http\Controllers\FeedbackController;

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

Route::middleware(['auth:sanctum', AdminMiddleware::class])->get('/admin/user', function (Request $request) {
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
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::post('/admin/movies', [MovieController::class, 'store']);
    Route::get('/admin/movies/{movie}/edit', [MovieController::class, 'edit']);
    Route::put('/admin/movies/{movie}', [MovieController::class, 'update']); 
    Route::delete('/admin/movies/{movie}', [MovieController::class, 'destroy']); 
});

// seats
Route::get('/movies/{movies}/seats', [SeatController::class, 'index']);
Route::get('/concerts/{concerts}/seats', [SeatController::class, 'index']);
Route::get('/standups/{standups}/seats', [SeatController::class, 'index']);

// register, login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->put('/user', [AuthController::class, 'updateProfile']);

// concerts
Route::get('/concerts', [ConcertController::class, 'index']);
Route::get('/concerts/{concert}', [ConcertController::class, 'show']);
// Admin routes (auth:sanctum + admin middleware)
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::post('/admin/concerts', [ConcertController::class, 'store']);
    Route::get('/admin/concerts/{concert}/edit', [ConcertController::class, 'edit']);
    Route::put('/admin/concerts/{concert}', [ConcertController::class, 'update']);
    Route::delete('/admin/concerts/{concert}', [ConcertController::class, 'destroy']);
});

// standups
Route::get('/standups', [StandupController::class, 'index']);
Route::get('/standups/{standup}', [StandupController::class, 'show']);
// Admin routes (auth:sanctum + admin middleware)
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::post('/admin/standups', [StandupController::class, 'store']);
    Route::get('/admin/standups/{standup}/edit', [StandupController::class, 'edit']);
    Route::put('/admin/standups/{standup}', [StandupController::class, 'update']);
    Route::delete('/admin/standups/{standup}', [StandupController::class, 'destroy']);
});

// tickets
Route::middleware('auth:sanctum')->group(function () {
    Route::get('tickets', [TicketController::class, 'index']);      
    Route::get('tickets/{ticket}', [TicketController::class, 'show']);    
    Route::post('tickets', [TicketController::class, 'store']);     
    Route::post('tickets/cancel', [TicketController::class, 'cancel']);
    Route::delete('tickets/{ticket}', [TicketController::class, 'destroy']); 
    Route::post('/payment/create-intent', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/payment/transaction', [PaymentController::class, 'storeTransaction']);
    Route::get('/payment/transactions', [PaymentController::class, 'getUserTransactions']);
    Route::post('/payment/refund', [PaymentController::class, 'refund']);
    Route::get('/showtimes/{showtime}/user-ticket-count', [TicketController::class, 'getUserTicketCount']);
});

// Temporarily public for debugging
Route::post('/seats/lock', [SeatBroadcastingController::class, 'lock']);
Route::post('/seats/unlock', [SeatBroadcastingController::class, 'unlock']);

// Feedback
Route::post('/feedback', [FeedbackController::class, 'store']);

// venues
Route::get('/venues', [VenueController::class, 'index']);
Route::get('/venues/{venue}', [VenueController::class, 'show']);
// Public: sections list for a venue (used by showtime creation form)
Route::get('/venues/{venue}/sections', [VenueLayoutController::class, 'getSections']);
// Public layout endpoint for customer seat-picker
Route::get('/venues/{venue}/layout', [VenueLayoutController::class, 'showPublished']);
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::post('/admin/venues', [VenueController::class, 'store']);
    Route::put('/admin/venues/{venue}', [VenueController::class, 'update']);
    Route::delete('/admin/venues/{venue}', [VenueController::class, 'destroy']);
    // Layout editor routes
    Route::get('/admin/venues/{venue}/layout', [VenueLayoutController::class, 'show']);
    Route::post('/admin/venues/{venue}/layout/draft', [VenueLayoutController::class, 'saveDraft']);
    Route::post('/admin/venues/{venue}/layout/publish', [VenueLayoutController::class, 'publish']);
});
// showtimes (sessions/seanses)
Route::get('/showtimes', [ShowtimeController::class, 'index']);
Route::get('/showtimes/{showtime}', [ShowtimeController::class, 'show']);
Route::get('/showtimes/{showtime}/section-prices', [ShowtimeController::class, 'sectionPrices']);

// Admin-only showtimes management
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::post('/admin/showtimes', [ShowtimeController::class, 'store']);
    Route::put('/admin/showtimes/{showtime}', [ShowtimeController::class, 'update']);
    Route::delete('/admin/showtimes/{showtime}', [ShowtimeController::class, 'destroy']);
});

Route::get('/test-broadcast', function() {
    try {
        broadcast(new \App\Events\SeatLocked('movies', 1, 'test-seat-id'));
        return "Broadcast successful!";
    } catch (\Exception $e) {
        return "Broadcast failed: " . $e->getMessage();
    }
});
