<?php

namespace App\Http\Controllers;

use App\Services\NinjaService;
use App\Services\QuickbaseService;
use App\Utils\StringUtils;
use Inertia\Inertia;

class ClientComparisonController extends Controller
{
    public function showComparison()
    {
        $quickbaseClients = $this->parseQuickbaseResponse($this->fetchQuickbaseClients());
        $invoiceClients = $this->parseNinjaResponse($this->fetchInvoiceNinjaClients());
        $quickbaseInvoices = $this->parseQuickbaseResponse($this->fetchQuickbaseInvoices());
        $invoiceInvoices = $this->parseNinjaInvoiceResponse($this->fetchInvoiceNinjaInvoices());
        $inconsistencies = $this->findClientInconsistencies($quickbaseClients, $invoiceClients);
        $inconsistencies2 = $this->findClientInconsistencies($invoiceClients, $quickbaseClients);
        return Inertia::render('Dashboard', [
            'quickbaseClients' => $quickbaseClients,
            'invoiceClients' => $invoiceClients,
            'quickbaseInvoices' => $quickbaseInvoices,
            'invoiceInvoices' => $invoiceInvoices,
            'inconsistencies' => [$inconsistencies, $inconsistencies2]
        ]);
    }

    private function parseQuickbaseResponse(array $body)
    {
        $data = $body['data'];
        $fields = $body['fields'];
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

    private function parseNinjaInvoiceResponse(array $response)
    {
        $invoiceData = [];
        foreach ($response['data'] as $item) {
            $invoice = [
                "invoiceNumber" => $item['number'],
                "clientNumber" => $item['client']['number'] ?? 'Unknown',
                "clientName" => $item['client']['name'] ?? 'Unknown',
                "item" => $item["line_items"][0]['product_key'],
                "description" => $item["line_items"][0]['product_key'],
                "amount" => $item["line_items"][0]['cost'],
            ];

            $invoiceData[] = $invoice;
        }

        return $invoiceData;
    }

    public function fetchQuickbaseClients()
    {
        $qb = new QuickbaseService();
        return $qb->fetchClients();
    }

    private function fetchInvoiceNinjaClients()
    {
        $ninja = NinjaService::getInstance();
        $clients = $ninja->clients->all();
        return $clients;
    }

    private function fetchInvoiceNinjaInvoices()
    {
        $ninja = NinjaService::getInstance();
        $clients = $ninja->invoices->all(['status' => 'active', 'include' => 'client']);
        return $clients;
    }

    private function fetchQuickbaseInvoices()
    {
        $qb = new QuickbaseService();

        return $qb->fetchInvoices();
    }

    /**
     * Compare two arrays of client records and find inconsistencies
     *
     * @param array $array1
     * @param array $array2
     * @return array
     */

    private function findClientInconsistencies(array $array1, array $array2): array
    {
        $inconsistencies = [];

        // Convert array2 to an associative array keyed by 'id' for efficient lookup
        $array2Assoc = [];
        foreach ($array2 as $client) {
            $array2Assoc[$client['number']] = $client;
        }

        // Loop through each client in array1
        foreach ($array1 as $client1) {
            $clientId = $client1['number'];

            // Check if the client exists in array2
            if (isset($array2Assoc[$clientId])) {
                $client2 = $array2Assoc[$clientId];

                // Compare fields between the two records
                $differences = array_diff_assoc($client1, $client2);

                // If there are any differences, log them
                if (!empty($differences)) {
                    $inconsistencies[$clientId] = [
                        'array1' => $client1,
                        'array2' => $client2,
                        'differences' => $differences
                    ];
                }
            } else {
                // If the client does not exist in array2, mark it as missing
                $inconsistencies[$clientId] = [
                    'array1' => $client1,
                    'array2' => null,
                    'differences' => ['Client missing:' => $client1['clientName']]
                ];
            }
        }

        return $inconsistencies;
    }
}
