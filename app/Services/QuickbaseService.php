<?php

namespace App\Services;

use App\Utils\StringUtils;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QuickbaseService
{
    private $apiBaseUrl;
    private $realmHostname;
    private $userToken;
    private $headers;
    private $tables = [
        "clients" => "bujf4sbzh",
        "payments" => "bujf53sz8"
    ];

    public function __construct()
    {
        // Set common properties for Quickbase API
        $this->apiBaseUrl = 'https://api.quickbase.com/v1/';
        $this->realmHostname = env('QB_REALM_HOST_NAME');
        $this->userToken = env('QB_USER_TOKEN');
        $this->headers = [
            'QB-Realm-Hostname' => $this->realmHostname,
            'User-Agent' => 'Invoice Sync',
            'Authorization' => 'QB-USER-TOKEN ' . $this->userToken,
            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Helper method for making Quickbase API requests
     *
     * @param string $endpoint
     * @param string $method
     * @param array $body
     * @return array
     */
    private function makeRequest($endpoint, $method = 'POST', $body = [])
    {
        $url = $this->apiBaseUrl . $endpoint;
        $response = Http::withHeaders($this->headers)->$method($url, $body);

        return $response->successful() ? $response->json() : ['error' => $response->body()];
    }

    /**
     * Fetch clients from Quickbase
     *
     * @return array
     */
    public function fetchClients()
    {
        $body = [
            'from' => $this->tables["clients"],
            'select' => [
                3,
                6,
                7,
                14,
                30,
                31,
                15,
                29
            ]  // Replace with field IDs
        ];

        return $this->makeRequest('records/query', 'POST', $body);
    }

    public function fetchInvoices()
    {
        $body = [
            'from' => $this->tables["invoices"],
            'select' => [6, 7, 9, 12, 13]  // Replace with field IDs
        ];

        return $this->makeRequest('records/query', 'POST', $body);
    }

    /**
     * Insert a new client into Quickbase
     *
     * @param array $clientData
     * @return array
     */
    public function insertClient(array $clientData)
    {
        $body = [
            'to' => $this->tables["clients"],
            'data' => [$clientData]
        ];

        return $this->makeRequest('records', 'POST', $body);
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

    public function getParsedClientRecord(string $clientNumber)
    {
        $clientRecord = $this->fetchClientRecord($clientNumber);
        return $this->parseQuickbaseResponse($clientRecord);
    }

    public function getParsedClientList()
    {
        $clients = $this->fetchClients();
        return $this->parseQuickbaseResponse($clients);
    }

    private function fetchClientRecord(string $clientNumber)
    {
        $body = [
            'from' => $this->tables['clients'],
            'select' => [
                3,
                6,
                7,
                14,
                30,
                31,
                15
            ],
            'where' => "{15.CT.'$clientNumber'}"
        ];
        return $this->makeRequest('records/query', 'POST', $body);
    }

    public function insertInvoice(array $invoiceData)
    {
        $clientRecord = $this->fetchClientRecord($invoiceData['clientNumber']);
        Log::info("Client data: " . json_encode($clientRecord, true));
        $clientRecordID = $clientRecord['data'][0]["3"]["value"];

        $body = [
            'to' => $this->tables["invoices"],
            'data' => [
                [
                    "6" => [
                        "value" => $invoiceData['clientName']
                    ],
                    "7" => [
                        "value" => $invoiceData['item']
                    ],
                    "8" => [
                        "value" => $invoiceData['description']
                    ],
                    "9" => [
                        "value" => $invoiceData['amount']
                    ],
                    "10" => [
                        "value" => $clientRecordID
                    ],
                    "12" => [
                        "value" => $invoiceData['clientNumber']
                    ],
                    "13" => [
                        "value" => $invoiceData['invoiceNumber']
                    ]
                ]
            ]
        ];

        return $this->makeRequest('records', 'POST', $body);
    }

    public function getPayments()
    {
        $body = [
            "from" => $this->tables['payments'],
            "select" => [
                6,
                7,
                13,
                15,
                17,
            ]
        ];

        return $this->makeRequest('records/query', 'POST', $body);
    }

    public function insertPayment(array $paymentData)
    {
        $clientRecord = $this->fetchClientRecord($paymentData['clientNumber']);
        Log::info("Client data: " . json_encode($clientRecord, true));
        $clientRecordID = $clientRecord['data'][0]["3"]["value"];

        $body = [
            'to' => $this->tables["payments"],
            'data' => [
                [
                    '6' => [
                        "value" => $paymentData['datePaid']
                    ],
                    '7' => [
                        "value" => $paymentData['amountPaid']
                    ],
                    "8" => [
                        'value' => $paymentData['billingPeriod']
                    ],
                    "9" => [
                        "value" => $paymentData['paymentMode']
                    ],
                    "13" => [
                        "value" => $paymentData['officialReceipt']
                    ],
                    "14" => [
                        "value" => $clientRecordID
                    ]
                ]
            ]
        ];
        return $this->makeRequest('records', 'POST', $body);
    }
}
