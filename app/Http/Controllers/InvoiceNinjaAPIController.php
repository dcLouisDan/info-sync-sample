<?php

namespace App\Http\Controllers;

use App\Services\NinjaService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvoiceNinjaAPIController extends Controller
{
    public function addClient(Request $request): RedirectResponse
    {
        // Validate the request data
        $validated = $request->validate([
            "number" => "required|string|max:255",
            "clientName" => "required|string|max:255",
            "contactFirstName" => "required|string|max:255",
            "contactLastName" => "required|string|max:255",
            "email" => "required|string|email|max:255", // Added email validation
        ]);

        $ninja = NinjaService::getInstance();

        try {
            // Create the client via Invoice Ninja API
            $ninja->clients->create([
                "number" => $validated['number'],
                "name" => $validated['clientName'],
                "contacts" => [
                    [
                        "first_name" => $validated['contactFirstName'],
                        "last_name" => $validated['contactLastName'],
                        "email" => $validated['email']
                    ]
                ]
            ]);
        } catch (Exception $e) {
            // Return a JSON response with the error message
            return redirect()->back()->with('error', "Error: " . $e->getMessage() . "/n Validated: " . json_encode($validated));
        }

        // Redirect to the dashboard with a success message
        return redirect()->route('dashboard')->with('success', 'Client added successfully!');
    }
}
