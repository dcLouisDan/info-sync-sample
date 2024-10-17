<?php

namespace App\Http\Controllers;

use App\Services\NinjaService;
use App\Services\QuickbaseService;
use App\Utils\StringUtils;
use Inertia\Inertia;
use InvoiceNinja\Sdk\Endpoints\Clients;

class ClientComparisonController extends Controller
{
    public function showComparison()
    {
        $qb = new QuickbaseService();

        $quickbaseClients = $this->parseQuickbaseResponse($qb->fetchClients());
        $invoiceClients = $this->parseNinjaClientResponse($this->fetchInvoiceNinjaClients());
        $inconsistencies = $this->findClientInconsistencies($quickbaseClients, $invoiceClients);
        $inconsistencies2 = $this->findClientInconsistencies($invoiceClients, $quickbaseClients);


        $quickbasePayments = $this->parseQuickbaseResponse($qb->getPayments());
        $ninjaPayments = $this->parseNinjaPaymentResponse($this->fetchInvoiceNinjaPayments());
        $paymentInconsistencies = $this->findPaymentInconsistencies($quickbasePayments, $ninjaPayments);
        return Inertia::render('DataComparison', [
            'quickbaseClients' => $quickbaseClients,
            'invoiceClients' => $invoiceClients,
            'inconsistencies' => [$inconsistencies, $inconsistencies2],
            'quickbasePayments' => $quickbasePayments,
            'ninjaPayments' => $ninjaPayments,
            // 'ninjaPayments' => $this->fetchInvoiceNinjaPayments(),
        ]);
    }

    private function parseQuickbaseResponse(array $body)
    {
        $data = $body['data'];
        $fields = $body['fields'];
        $clientData = [];
        foreach ($data as $item) {
            $client = [];
            $exceptions = ['recordId', 'alternateContactName', 'alternateContactNumber'];
            foreach ($fields as $field) {
                $label = StringUtils::toCamelCase($field['label']);
                if (in_array($label, $exceptions)) {
                    continue;
                }
                $client[$label] = $item[$field['id']]['value'];
            }
            $clientData[] = $client;
        }

        return $clientData;
    }

    private function parseNinjaClientResponse(array $response)
    {
        $clientData = [];
        foreach ($response['data'] as $item) {
            $client = [
                "userid" => $item['number'],
                "customer" => $item['contacts'][0]['last_name'] . ", " . $item['contacts'][0]['first_name'],
                "address" => $item["address1"] . " " . $item['address2'] . ", " . $item['city'] . ", " . $item['state'] . " " . $item['postal_code'] . " Philippines",
                "mobileNumber" => $item['phone'],
                "emailAddress" => $item['contacts'][0]['email'],
            ];

            $clientData[] = $client;
        }

        return $clientData;
    }

    private function parseNinjaPaymentResponse(array $response)
    {
        $paymentData = [];
        foreach ($response['data'] as $item) {
            $payment = [
                "datePaid" => $item['date'],
                "amountPaid" => $item['amount'],
                "officialReceipt" => "OR" . $item['transaction_reference'],
                "customer" => $item['client']['contacts'][0]['last_name'] . ", " . $item['client']['contacts'][0]['first_name'],
                "planName" => $item['invoices'][0]['line_items'][0]['product_key']
            ];

            $paymentData[] = $payment;
        }

        return $paymentData;
    }


    private function fetchInvoiceNinjaClients()
    {
        $ninja = NinjaService::getInstance();
        $clients = $ninja->clients->all(["status" => "active"]);
        return $clients;
    }

    private function fetchInvoiceNinjaPayments()
    {
        $ninja = NinjaService::getInstance();
        $clients = $ninja->payments->all(['include' => 'client,invoices', "is_deleted" => false]);
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

    private function findPaymentInconsistencies(array $array1, array $array2): array
    {
        $inconsistencies = [];

        // Convert array2 to an associative array keyed by 'id' for efficient lookup
        $array2Assoc = [];
        foreach ($array2 as $record) {
            $key = $record['officialReceipt'];
            $array2Assoc[$key] = $record;
        }

        // Loop through each record in array1
        foreach ($array1 as $record1) {
            // dd($record1);
            $recordId = $record1['officialReceipt'];

            // Check if the record exists in array2
            if (isset($array2Assoc[$recordId])) {
                $record2 = $array2Assoc[$recordId];

                // Compare fields between the two records
                $differences = array_diff_assoc($record1, $record2);

                // If there are any differences, log them
                if (!empty($differences)) {
                    $inconsistencies[$recordId] = [
                        'array1' => $record1,
                        'array2' => $record2,
                        'differences' => $differences
                    ];
                }
            } else {
                // If the record does not exist in array2, mark it as missing
                $inconsistencies[$recordId] = [
                    'array1' => $record1,
                    'array2' => null,
                    'differences' => ['record missing:' => $record1['customer']]
                ];
            }
        }

        return $inconsistencies;
    }
}
