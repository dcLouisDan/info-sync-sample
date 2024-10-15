<?php

use App\Http\Controllers\ClientComparisonController;
use App\Http\Controllers\InvoiceNinjaAPIController;
use App\Http\Controllers\InvoiceNinjaWebhookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuickbaseAPIController;
use App\Http\Controllers\QuickbaseWebhookController;
use App\Http\Middleware\LogRequestResponse;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', [ClientComparisonController::class, 'showComparison'])->middleware(['auth'])->name('dashboard');
Route::get('/service-report', function() {
    return Inertia::render('ServiceReport');
})->name('serviceReport');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post("/ninja/client/add", [InvoiceNinjaAPIController::class, 'addClient'])->name("ninjaClient.add");

    // Fetch all clients
    Route::get('/quickbase/clients', [QuickbaseAPIController::class, 'fetchClients']);

    // Insert a new client
    Route::post('/quickbase/clients', [QuickbaseAPIController::class, 'insertClient']);

    // Update an existing client
    Route::put('/quickbase/clients/{clientId}', [QuickbaseAPIController::class, 'updateClient']);

    // Delete a client
    Route::delete('/quickbase/clients/{clientId}', [QuickbaseAPIController::class, 'deleteClient']);
});

Route::post('/webhook/quickbase/client', [QuickbaseWebhookController::class, 'handle']);
Route::post('/webhook/ninja/invoice', [InvoiceNinjaWebhookController::class, 'invoice'])->middleware(LogRequestResponse::class);
Route::post('/webhook/ninja/payment', [InvoiceNinjaWebhookController::class, 'payment'])->middleware(LogRequestResponse::class);




require __DIR__ . '/auth.php';
