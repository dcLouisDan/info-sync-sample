<?php

namespace App\Services;

use App\Utils\ArrayUtils;
use Illuminate\Support\Facades\Cache;
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

  public static function fetchActiveClientsWithOverdue($current_page = 1)
  {
    $cacheKey = "overdue_clients_page_{$current_page}";

    // Use cache to store results, expiring after 1 hour
    return Cache::remember($cacheKey, now()->addHour(), function () use ($current_page) {
      $clientsWithInvoices = [];

      $clientsRaw = self::$instance->clients->all([
        'status' => 'active',
        'per_page' => 20,
        'is_deleted' => 'false',
        'page' => $current_page
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

      return [
        "data" => $clientsWithInvoices,
        "pagination" => $clientsRaw['meta']['pagination']
      ];
    });
  }
}
