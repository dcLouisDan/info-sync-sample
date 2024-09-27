<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QuickbaseService
{
  private $apiBaseUrl;
  private $realmHostname;
  private $userToken;
  private $headers;
  private $tables = [
    "clients" => "buiq4dven",
    "invoices" => "buiq4exu8"
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
      'select' => [6, 7, 8, 11]  // Replace with field IDs
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

  public function fetchClientRecordId(string $clientNumber)
  {
    $body = [
      'from' => $this->tables['clients'],
      'select' => [
        3,
        11
      ],
      'where' => "{11.CT.'$clientNumber'}"
    ];
    return $this->makeRequest('records/query', 'POST', $body);
  }

  /**
   * Update an existing client in Quickbase
   * 
   * @param string $clientId
   * @param array $clientData
   * @return array
   */
  public function updateClient($clientId, array $clientData)
  {
    $body = [
      'to' => $this->tables["clients"],
      'data' => [
        [
          'recordId' => $clientId,
          'fields' => $clientData
        ]
      ]
    ];

    return $this->makeRequest('records', 'PUT', $body);
  }

  public function insertInvoice(array $invoiceData)
  {
    $clientRecord = $this->fetchClientRecordId($invoiceData['clientNumber']);
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

  /**
   * Handle webhook data for client creation and update Invoice Ninja
   * 
   * @param array $webhookData
   * @return void
   */
  public function handleWebhookData(array $webhookData)
  {
    // Parse webhook data and sync with Invoice Ninja or other services
    // Implement your data sync logic here
  }
}
