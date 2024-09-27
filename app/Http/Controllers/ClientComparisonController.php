<?php

namespace App\Http\Controllers;

use App\Services\NinjaService;
use App\Services\QuickbaseService;
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
        $quickbaseInvoices = $this->fetchQuickbaseInvoices();

        // Fetch clients from Invoice Ninja
        $invoiceClients = $this->fetchInvoiceNinjaClients();
        $invoiceInvoices = $this->fetchInvoiceNinjaInvoices();

        return Inertia::render('Dashboard', [
            'quickbaseClients' => $this->parseQuickbaseResponse($quickbaseClients),
            'invoiceClients' => $this->parseNinjaResponse($invoiceClients),
            'quickbaseInvoices' => $this->parseQuickbaseResponse($quickbaseInvoices),
            'invoiceInvoices' => $this->parseNinjaInvoiceResponse($invoiceInvoices),
            'ninjaInvoices' => $invoiceInvoices['data']
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
}
