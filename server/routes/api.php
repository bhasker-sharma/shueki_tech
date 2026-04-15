<?php

use App\Http\Controllers\API\EnquiryController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\FaqController;
use Illuminate\Support\Facades\Route;

// Public API Routes
Route::post('/enquiry', [EnquiryController::class, 'store']);
Route::get('/projects', [ProjectController::class, 'publicIndex']);
Route::get('/projects/{project}', [ProjectController::class, 'publicShow']);
Route::get('/testimonials', [TestimonialController::class, 'publicIndex']);
Route::get('/faqs', [FaqController::class, 'publicIndex']);

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

        // Project management (POST for both create and update — PHP $_FILES only works with POST)
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::post('/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

        // FAQ management
        Route::get('/faqs', [FaqController::class, 'index']);
        Route::post('/faqs', [FaqController::class, 'store']);
        Route::patch('/faqs/{faq}', [FaqController::class, 'update']);
        Route::delete('/faqs/{faq}', [FaqController::class, 'destroy']);

        // Testimonial management
        Route::get('/testimonials', [TestimonialController::class, 'index']);
        Route::post('/testimonials', [TestimonialController::class, 'store']);
        Route::patch('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
        Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
    });
});
