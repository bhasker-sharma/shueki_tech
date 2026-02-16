<?php

use App\Http\Controllers\API\EnquiryController;
use Illuminate\Support\Facades\Route;

// Public API Routes
Route::post('/enquiry', [EnquiryController::class, 'store']);

// Admin Routes
Route::prefix('admin')->group(function () {
    // Login (no auth required)
    Route::post('/login', [\App\Http\Controllers\Admin\AuthController::class, 'login']);

    // Protected admin routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [\App\Http\Controllers\Admin\AuthController::class, 'logout']);
        Route::get('/me', [\App\Http\Controllers\Admin\AuthController::class, 'me']);

        // Dashboard stats
        Route::get('/stats', [\App\Http\Controllers\Admin\EnquiryController::class, 'stats']);

        // Enquiry management
        Route::get('/enquiries', [\App\Http\Controllers\Admin\EnquiryController::class, 'enquiries']);
        Route::patch('/enquiries/{id}/status', [\App\Http\Controllers\Admin\EnquiryController::class, 'updateStatus']);
        Route::post('/enquiries/{id}/comments', [\App\Http\Controllers\Admin\EnquiryController::class, 'addComment']);
        Route::delete('/enquiries/{id}', [\App\Http\Controllers\Admin\EnquiryController::class, 'delete']);
    });
});
