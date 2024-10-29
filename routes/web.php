<?php

use App\Http\Controllers\ClientComparisonController;
use App\Http\Controllers\InvoiceNinjaAPIController;
use App\Http\Controllers\InvoiceNinjaWebhookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuickbaseAPIController;
use App\Http\Controllers\QuickbaseWebhookController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\LogRequestResponse;
use App\Services\QuickbaseService;
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

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

Route::get('/service-report', function () {
    $qb = new QuickbaseService();
    $clientList = $qb->getParsedClientList();
    return Inertia::render('ServiceReport', [
        "clientList" => $clientList
    ]);
})->name('serviceReport');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post("/ninja/client/add", [InvoiceNinjaAPIController::class, 'addClient'])->name("ninjaClient.add");

    // Fetch all clients
    Route::get('/quickbase/clients', [QuickbaseAPIController::class, 'fetchClients']);

    Route::get('/data-comparison', [ClientComparisonController::class, 'showComparison'])->name('dataComparison');
});

Route::middleware('auth')->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('user.index');
    Route::post('/user/create', [UserController::class, 'createUser'])->name('user.create');
    Route::put('/user/update/{user}', [UserController::class, 'updateUser'])->name('user.update');
    Route::get('/user/delete/{user}', [UserController::class, 'deleteUser'])->name('user.delete');
})->middleware(AdminMiddleware::class);


Route::post('/webhook/quickbase/client', [QuickbaseWebhookController::class, 'handle']);
Route::post('/webhook/ninja/invoice', [InvoiceNinjaWebhookController::class, 'invoice'])->middleware(LogRequestResponse::class);
Route::post('/webhook/ninja/payment', [InvoiceNinjaWebhookController::class, 'payment'])->middleware(LogRequestResponse::class);




require __DIR__ . '/auth.php';
