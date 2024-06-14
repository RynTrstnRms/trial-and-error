<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        // Find the user first to get the current email
        $user = User::findOrFail($id);

        // Validation rules
        $rules = [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id), // Ignore current user's email
            ],
            'role' => 'required|string|in:admin,doctor,patient,receptionist'
        ];

        // Validate request data
        $validator = Validator::make($request->all(), $rules);

        // Return validation errors if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        // Update user details
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->role = $request->input('role');
        $user->save();

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User removed successfully']);
    }


    // Register new user
    public function register(Request $request)
    {
        // Validation rules (same as before)
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:4',
            'role' => 'required|string|in:admin,doctor,patient,receptionist'
        ];

        // Validate request data (same as before)
        $validator = Validator::make($request->all(), $rules);

        // Return validation errors if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        // Hash the password
        $hashedPassword = Hash::make($request->password);

        // Create new user with hashed password
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $hashedPassword,
            'role' => $request->role,
        ]);

        // Return success response
        return response()->json(['message' => 'User registered successfully'], 201);
    }

    // User login
    public function login(Request $request)
    {
        // Validation rules (same as before)
        $rules = [
            'email' => 'required|string|email',
            'password' => 'required|string|min:4',
        ];

        // Validate request data (same as before)
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Check if user exists
        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Check password match
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Return user details
        return response()->json(['user' => $user], 200);
    }

    // User logout
    public function logout(Request $request)
    {
        // Revoke access token
        $token = $request->user()->token();
        $token->revoke();

        // Return success response
        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    // Get all users
    public function getAllUsers()
    {
        // Get all users from database
        $users = User::all();
        // Return users data
        return response()->json(['users' => $users], 200);
    }

    public function getUsersByRole($role)
    {
        // Validate role
        $validRoles = ['admin', 'doctor', 'patient'];
        if (!in_array($role, $validRoles)) {
            return response()->json(['message' => 'Invalid role'], 400);
        }

        // Get users by role from the database
        $users = User::where('role', $role)->get();

        // Return users data
        return response()->json(['users' => $users], 200);
    }
}
