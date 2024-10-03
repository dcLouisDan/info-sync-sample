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
        $inconsistencies = $this->findClientInconsistencies($quickbaseClients, $invoiceClients);
        $inconsistencies2 = $this->findClientInconsistencies($invoiceClients, $quickbaseClients);
        return Inertia::render('Dashboard', [
            'quickbaseClients' => $quickbaseClients,
            'invoiceClients' => $invoiceClients,
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
                "userid" => $item['number'],
                "customer" => $item['contacts'][0]['last_name'] . ", " . $item['contacts'][0]['first_name'],
                "address" => $item["address1"] . " " . $item['address2'] . ", " . $item['city'] . ", " . $item['state'] . " " . $item['postal_code'] . " Philippines",
                "mobileNumber" => $item['phone'],
            ];

            $clientData[] = $client;
        }

        return $clientData;
    }

    public function fetchQuickbaseClients()
    {
        $qb = new QuickbaseService();
        return $qb->fetchClients();
    }

    private function fetchInvoiceNinjaClients()
    {
        $ninja = NinjaService::getInstance();
        $clients = $ninja->clients->all(["status" => "active"]);
        return $clients;
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
            $key = $client['number'] ?? $client['userid'];
            $array2Assoc[$key] = $client;
        }

        // Loop through each client in array1
        foreach ($array1 as $client1) {
            // dd($client1);
            $clientId = $client1['number'] ?? $client1['userid'];

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
                    'differences' => ['Client missing:' => $client1['customer']]
                ];
            }
        }

        return $inconsistencies;
    }
}
