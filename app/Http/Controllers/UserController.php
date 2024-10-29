<?php


namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return Inertia::render('Admin/Users', ['users' => $users]);
    }

    public function createUser(Request $request)
    {

        $requestBody = $request->getContent();  // Fetch the raw request body
        Log::info('API Response: ', [
            'status' => 200, // You can log the status if needed
            'url' => $request->fullUrl(),  // Logs the full URL of the request
            'body' => json_decode($requestBody, true) // Decode the JSON request body
        ]);
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|string|in:user,admin',
        ]);

        $result = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash the password
            'role' => $request->role,
        ]);

        Log::info('User: ', ['res' => $result]);

        return redirect()->route('user.index')->with('success', 'User created successfully!');
    }

    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'
                . $user->id,
            'password' => [
                'nullable',
                'confirmed',
                Password::defaults()
            ], // Password is nullable
            'role' => 'required|string|in:user,admin',
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        // Update password only if provided
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return redirect()->route('user.index')->with('success', 'User updated successfully!');
    }
}
