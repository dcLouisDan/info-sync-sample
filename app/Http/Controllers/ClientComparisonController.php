<?php

namespace App\Http\Controllers;

use App\Services\NinjaService;
use App\Utils\StringUtils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use InvoiceNinja\Sdk\InvoiceNinja;

class ClientComparisonController extends Controller
{
    public function showComparison()
    {
        // Fetch clients from Quickbase
        $quickbaseClients = $this->fetchQuickbaseClients();

        // Fetch clients from Invoice Ninja
        $invoiceClients = $this->fetchInvoiceNinjaClients();

        return Inertia::render('Dashboard', [
            'quickbaseClients' => $this->parseQuickbaseResponse($quickbaseClients['data'], $quickbaseClients['fields']),
            'invoiceClients' => $this->parseNinjaResponse($invoiceClients)
        ]);
    }

    private function parseQuickbaseResponse(array $data, array $fields)
    {
        $clientData = [];
        foreach ($data as $item) {
            $client = [];
            foreach ($fields as $field) {
                $label = StringUtils::toCamelCase($field['label']);
                $client[$label] = $item[$field['id']]['value'];
            }
            $clientData[] = $client;
        }

        return $clientData;
    }

    private function parseNinjaResponse(array $response)
    {
        $clientData = [];
        foreach ($response['data'] as $item) {
            $client = [
                "number" => $item['number'],
                "clientName" => $item['name'],
                "contactName" => $item['contacts'][0]['first_name'] . " " . $item['contacts'][0]['last_name'],
                "email" => $item['contacts'][0]['email'],
            ];

            $clientData[] = $client;
        }

        return $clientData;
    }

    public function fetchQuickbaseClients()
    {
        // Replace with your Quickbase API details
        $response = Http::withHeaders([
            'QB-Realm-Hostname' => env("QB_REALM_HOST_NAME"),
            'User-Agent' => 'Invoice Sync Test',
            'Authorization' => 'QB-USER-TOKEN ' . env("QB_USER_TOKEN"),
            'Content-Type' => 'application/json',
        ])->post('https://api.quickbase.com/v1/records/query', [
            'from' => 'buiq4dven',
            'select' => [
                6,
                7,
                8,
                11
            ],
        ]);

        return $response->json();
    }

    private function fetchInvoiceNinjaClients()
    {
        $ninja = NinjaService::getInstance();
        $clients = $ninja->clients->all();

        return $clients;
    }
}
