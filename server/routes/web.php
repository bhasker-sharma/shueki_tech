<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SetupController;

Route::get('/', function () {
    return view('welcome');
});

// Setup routes for shared hosting (can be removed after setup)
Route::get('/setup', [SetupController::class, 'install']);
Route::get('/setup/status', [SetupController::class, 'status']);
