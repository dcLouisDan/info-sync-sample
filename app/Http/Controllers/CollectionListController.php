<?php

namespace App\Http\Controllers;

use App\Services\NinjaService;
use App\Services\QuickbaseService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use phpDocumentor\Reflection\Types\This;

class CollectionListController extends Controller
{
    public function index()
    {
        return Inertia::render("CollectionList");
    }

    public function fetch(int $page = 1)
    {
        NinjaService::getInstance();
        $clientsWithOverdueBalance = NinjaService::fetchActiveClientsWithOverdue($page);
        return $clientsWithOverdueBalance;
    }

    public function groupByBaranggay($clients, $field)
    {
        $grouped_clients = [];
        foreach ($clients as $client) {
            $barangay = trim($client[$field]);
            if (!isset($grouped_clients[$barangay])) {
                $grouped_clients[$barangay] = [];
            }
            $grouped_clients[$barangay][] = $client;
        }

        // dd($grouped_clients);

        return $grouped_clients;
    }
}
