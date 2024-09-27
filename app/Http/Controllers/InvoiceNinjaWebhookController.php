<?php

namespace App\Http\Controllers;

use App\Services\QuickbaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InvoiceNinjaWebhookController extends Controller
{
    //
    public function handle(Request $request)
    {
        // Log the incoming request data
        $requestBody = $request->getContent();  // Fetch the raw request body
        Log::info('API Response: ', [
            'status' => 200, // You can log the status if needed
            'url' => $request->fullUrl(),  // Logs the full URL of the request
            'body' => json_decode($requestBody, true) // Decode the JSON request body
        ]);

        $requestData = json_decode($requestBody, true);

        // Check if the request body was successfully decoded into an array
        if (is_array($requestData)) {
            // Example: Accessing specific data from the request
            $invoiceData = [
                "invoiceNumber" => $requestData['number'],
                "clientNumber" => $requestData['client']['number'] ?? 'Unknown',
                "clientName" => $requestData['client']['name'] ?? 'Unknown',
                "item" => $requestData["line_items"][0]['product_key'],
                "description" => $requestData["line_items"][0]['product_key'],
                "amount" => $requestData["line_items"][0]['cost'],
            ];

            $qb = new QuickbaseService();
            return $qb->insertInvoice($invoiceData);
        } else {
            Log::warning('Failed to decode request body as JSON');
        }

        return response()->json(json_decode($requestBody, true));
    }
}
