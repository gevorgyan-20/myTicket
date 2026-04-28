<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // ✅ Hash
use Illuminate\Validation\ValidationException; // ✅ For custom error response

class AuthController extends Controller
{
    // ✅ REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'name'                  => 'required|string|max:255',
            'last_name'             => 'nullable|string|max:255',
            'phone'                 => 'nullable|string|max:20',
            'country_code'          => 'nullable|string|max:10',
            'email'                 => 'required|string|email|unique:users',
            'password'              => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name'       => $request->name,
            'last_name'  => $request->last_name,
            'phone_code' => $request->country_code,
            'phone'      => $request->phone,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'       => 'required|string|max:255',
            'last_name'  => 'nullable|string|max:255',
            'phone_code' => 'nullable|string|max:10',
            'phone'      => 'nullable|string|max:20',
            'email'      => 'required|string|email|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name'       => $request->name,
            'last_name'  => $request->last_name,
            'phone_code' => $request->phone_code,
            'phone'      => $request->phone,
            'email'      => $request->email,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $user
        ]);
    }

    // ✅ LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw validationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
    
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
    
}
