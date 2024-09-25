<?php

namespace App\Services;

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
    $ninja->setUrl(env('INVOICE_NINJA_HOST'));
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
}
