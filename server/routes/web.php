<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SetupController;

Route::get('/', function () {
    return view('welcome');
});

// Serve storage files directly — PHP's built-in dev server on Windows doesn't follow symlinks.
// This is a fallback that works both locally and on shared hosting.
Route::get('/storage/{path}', function (string $path) {
    $file = storage_path('app/public/' . $path);
    if (!is_file($file)) {
        abort(404);
    }
    return response()->file($file);
})->where('path', '.*');

// Setup routes for shared hosting (can be removed after setup)
Route::get('/setup', [SetupController::class, 'install']);
Route::get('/setup/status', [SetupController::class, 'status']);
