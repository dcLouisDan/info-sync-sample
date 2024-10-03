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
        $clientName = StringUtils::separateName($clientData['customer']);
        $altName = StringUtils::separateName($clientData['altContactName']);


        $ninja->clients->create([
            "contacts" => [
                [
                    "first_name" => $clientName['first_name'],
                    "last_name" => $clientName['last_name'],
                    "email" => $clientData['email'],
                    "phone" => $clientData['phone']
                ],
                [
                    "first_name" => $altName['first_name'],
                    "last_name" => $altName['last_name'],
                    "phone" => $clientData['altContactPhone']
                ]
            ],
            "name" => $clientName['first_name'] . " " . $clientName['last_name'],
            "address1" => $clientData["addressStreet1"],
            "address2" => $clientData["addressStreet2"],
            "city" => $clientData["city"],
            "state" => $clientData["state"],
            "postal_code" => $clientData["postalCode"],
            "country_id" => "608",
            "phone" => $clientData['phone'],
            "number" =>  $clientData['userID'],

            "custom_value1" => "Application Date: " . $clientData['applicationDate'],
            "custom_value2" => "Activation Date: " . $clientData['dateInstalled'],
            "custom_value3" => "Service Plan: " . $clientData['planName']
        ]);

        return response()->json(['status' => 'success', 'message' => 'Client synced to Invoice Ninja']);
    }
}
