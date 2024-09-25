<?php

namespace App\Http\Controllers;

use App\Services\NinjaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use InvoiceNinja\Sdk\InvoiceNinja;

class ClientComparisonController extends Controller
{
    public function showComparison()
    {
        // Fetch clients from Quickbase
        $quickbaseClients = $this->fetchQuickbaseClients();

        // Fetch clients from Invoice Ninja
        $invoiceClients = $this->fetchInvoiceNinjaClients();

        return view('dashboard', [
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
                $client[$field['label']] = $item[$field['id']]['value'];
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
                "Client Name" => $item['name'],
                "Contact Name" => $item['contacts'][0]['first_name'] . " " . $item['contacts'][0]['last_name'],
                "Email" => $item['contacts'][0]['email']
            ];

            $clientData[] = $client;
        }

        return $clientData;
    }

    private function fetchQuickbaseClients()
    {
        // Replace with your Quickbase API details
        $response = Http::withHeaders([
            'QB-Realm-Hostname' => 'builderprogram-ddelacruz6769.quickbase.com',
            'User-Agent' => 'Invoice Sync Test',
            'Authorization' => 'QB-USER-TOKEN b9zxjm_rcks_0_q5pjufdi7bwbadjxbxpgbpw7i6t',
            'Content-Type' => 'application/json',
        ])->post('https://api.quickbase.com/v1/records/query', [
            'from' => 'buiq4dven',
            'select' => [
                6,
                7,
                8
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
