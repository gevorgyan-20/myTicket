<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Sanctum authentication — user() method է օգտագործվում
        if (!$request->user()) {
            return response()->json(['message' => 'Please log in first.'], 401);
        }
    
        // Admin role-ի ստուգում
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Access denied. Admins only.'], 403);
        }
    
        return $next($request);
    }
}
