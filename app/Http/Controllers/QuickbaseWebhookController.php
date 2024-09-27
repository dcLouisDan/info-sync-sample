<?php

namespace App\Http\Controllers;

use App\Services\NinjaService;
use App\Utils\StringUtils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QuickbaseWebhookController extends Controller
{
    //
    public function handle(Request $request)
    {
        $ninja = NinjaService::getInstance();
        $clientData = $request;
        $clientName = StringUtils::separateName($clientData['contactName']);


        $ninja->clients->create([
            "number" =>  $clientData['number'],
            "name" => $clientData['clientName'],
            "contacts" => [
                "first_name" => $clientName['first_name'],
                "last_name" => $clientName['last_name'],
                "email" => $clientData['email']
            ]
        ]);

        return response()->json(['status' => 'success', 'message' => 'Client synced to Invoice Ninja']);
    }
}
