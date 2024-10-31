<?php

namespace App\Services;

use App\Utils\ArrayUtils;
use InvoiceNinja\Ninja;
use InvoiceNinja\Sdk\InvoiceNinja;

class NinjaService
{
  private static $instance = null;

  // Private constructor to prevent multiple instances
  private function __construct()
  {
    // Setup the SDK configuration only once
    $ninja = new InvoiceNinja(env('INVOICE_NINJA_API_KEY'));
    // $ninja->setUrl(env('INVOICE_NINJA_HOST'));
    $ninja->setOptions(['verify' => false]);
    self::$instance = $ninja;
  }

  // Public method to get the instance of Ninja object
  public static function getInstance()
  {
    // Set custom headers if any
    if (!self::$instance) {
      $ninja = new InvoiceNinja(env('INVOICE_NINJA_API_KEY'));
      $ninja->setUrl(env('INVOICE_NINJA_HOST'));
      $ninja->setOptions(['verify' => false]);
      self::$instance = $ninja;
    }
    return self::$instance;
  }

  public static function fetchActiveClientsWithOverdue()
  {
    $clientsWithInvoices = [];
    $currentPage = 1;
    $hasMorePages = true;

    while ($hasMorePages) {
      $clientsRaw = self::$instance->clients->all([
        'status' => 'active',
        'per_page' => 100,  // Keep a reasonable page size
        'is_deleted' => 'false',
        'page' => $currentPage, // Fetch a specific page
      ]);
      $clients = $clientsRaw['data'];

      foreach ($clients as $client) {
        $invoices = self::$instance->invoices->all([
          "client_id" => $client['id'],
          "client_status" => "unpaid",
          "overdue" => ""
        ]);
        if (count($invoices['data']) > 0) {
          $overdue_balance = 0;
          foreach ($invoices['data'] as $invoice) {
            $overdue_balance += $invoice['balance'];
          }
          $client['overdue_invoices'] = $invoices['data'];
          $client['overdue_balance'] = $overdue_balance;
          $clientsWithInvoices[] = $client;
        }
      }

      $hasMorePages = $clientsRaw['meta']['current_page'] < $clientsRaw['meta']['total_pages'];
      $currentPage++;
    }

    return $clientsWithInvoices;
  }
}
