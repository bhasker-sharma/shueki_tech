<?php

use App\Http\Controllers\API\EnquiryController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\CompanySettingController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\QuotationController;
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

        // Customer management
        Route::get('/customers', [CustomerController::class, 'index']);
        Route::post('/customers', [CustomerController::class, 'store']);
        Route::get('/customers/{customer}', [CustomerController::class, 'show']);
        Route::patch('/customers/{customer}', [CustomerController::class, 'update']);
        Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);
        Route::post('/customers/{customer}/link-enquiry/{enquiryId}', [CustomerController::class, 'linkEnquiry']);
        Route::post('/enquiries/{enquiryId}/unlink', [CustomerController::class, 'unlinkEnquiry']);
        Route::get('/unlinked-enquiries', [CustomerController::class, 'unlinkedEnquiries']);

        // Invoice management
        Route::get('/invoices', [InvoiceController::class, 'index']);
        Route::post('/invoices', [InvoiceController::class, 'store']);
        Route::get('/invoices/{invoice}', [InvoiceController::class, 'show']);
        Route::patch('/invoices/{invoice}', [InvoiceController::class, 'update']);
        Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy']);

        // Quotation management
        Route::get('/quotations', [QuotationController::class, 'index']);
        Route::post('/quotations', [QuotationController::class, 'store']);
        Route::get('/quotations/{quotation}', [QuotationController::class, 'show']);
        Route::patch('/quotations/{quotation}', [QuotationController::class, 'update']);
        Route::delete('/quotations/{quotation}', [QuotationController::class, 'destroy']);

        // Company settings
        Route::get('/settings/company', [CompanySettingController::class, 'show']);
        Route::post('/settings/company', [CompanySettingController::class, 'update']);

        // Payment methods
        Route::get('/payment-methods', [PaymentMethodController::class, 'index']);
        Route::post('/payment-methods', [PaymentMethodController::class, 'store']);
        Route::patch('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'update']);
        Route::delete('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'destroy']);
    });
});
