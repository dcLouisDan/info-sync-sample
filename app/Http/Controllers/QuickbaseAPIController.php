<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class QuickbaseAPIController extends Controller
{
    // Define common class properties for Quickbase API details
    private $apiBaseUrl;
    private $realmHostname;
    private $userToken;
    private $headers;

    /**
     * Constructor to set up the common properties
     */
    public function __construct()
    {
        $this->apiBaseUrl = 'https://api.quickbase.com/v1/';
        $this->realmHostname = env("QB_REALM_HOST_NAME");
        $this->userToken = env("QB_USER_TOKEN");
        $this->headers = [
            'QB-Realm-Hostname' => $this->realmHostname,
            'User-Agent' => 'Invoice Sync Test',
            'Authorization' => 'QB-USER-TOKEN ' . $this->userToken,
            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Helper method to make a request to Quickbase
     * 
     * @param string $endpoint The API endpoint (e.g., 'records/query')
     * @param string $method HTTP method (e.g., 'POST', 'GET', 'PUT', 'DELETE')
     * @param array $body The body of the request
     * @return \Illuminate\Http\JsonResponse
     */
    private function quickbaseRequest($endpoint, $method, $body = [])
    {
        $url = $this->apiBaseUrl . $endpoint;

        // Make the HTTP request using Laravel's HTTP client
        $response = Http::withHeaders($this->headers)->$method($url, $body);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => 'Failed to communicate with Quickbase',
            'status' => $response->status(),
            'body' => $response->body()
        ];
    }

    /**
     * Fetch all clients from the clients table.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchClients()
    {
        // The Quickbase clients table ID
        $tableId = 'your_clients_table_id';

        // Define the request body
        $body = [
            'from' => $tableId,
            'select' => [6, 7, 8, 11]  // Replace with your actual field IDs
        ];

        // Use the helper method to make the request
        $clients = $this->quickbaseRequest('records/query', 'POST', $body);

        return response()->json($clients);
    }

    /**
     * Insert a new client into the clients table.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function insertClient(Request $request)
    {
        // The Quickbase clients table ID
        $tableId = 'your_clients_table_id';

        // Example data to insert
        $data = [
            '6' => ['value' => $request->input('name')],
            '7' => ['value' => $request->input('email')],
            '8' => ['value' => $request->input('phone')],
            '11' => ['value' => $request->input('notes')],
        ];

        // Define the request body
        $body = [
            'to' => $tableId,
            'data' => [$data]
        ];

        // Use the helper method to make the request
        $response = $this->quickbaseRequest('records', 'POST', $body);

        return response()->json($response);
    }

    /**
     * Update a client in the clients table.
     *
     * @param Request $request
     * @param string $clientId The ID of the client to update
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateClient(Request $request, $clientId)
    {
        // The Quickbase clients table ID
        $tableId = 'your_clients_table_id';

        // Example data to update
        $data = [
            '6' => ['value' => $request->input('name')],
            '7' => ['value' => $request->input('email')],
        ];

        // Define the request body
        $body = [
            'to' => $tableId,
            'data' => [
                [
                    'recordId' => $clientId,
                    'fields' => $data
                ]
            ]
        ];

        // Use the helper method to make the request
        $response = $this->quickbaseRequest('records', 'PUT', $body);

        return response()->json($response);
    }

    /**
     * Delete a client from the clients table.
     *
     * @param string $clientId The ID of the client to delete
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteClient($clientId)
    {
        // The Quickbase clients table ID
        $tableId = 'your_clients_table_id';

        // Define the request body
        $body = [
            'from' => $tableId,
            'where' => "{'recordId' = '$clientId'}"
        ];

        // Use the helper method to make the request
        $response = $this->quickbaseRequest('records', 'DELETE', $body);

        return response()->json($response);
    }
}
