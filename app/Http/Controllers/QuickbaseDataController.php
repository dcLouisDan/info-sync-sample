<?php

namespace App\Http\Controllers;

use App\Services\QuickbaseService;
use Illuminate\Http\Request;

class QuickbaseDataController extends Controller
{
    public function fetchClientRecord($number)
    {
        $qb = new QuickbaseService();

        return $qb->getParsedClientRecord($number);
    }
}
