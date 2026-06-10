<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('label');                      // e.g. "HDFC Bank", "GPay / PhonePe"
            $table->string('type')->default('bank');      // bank | upi | other
            $table->text('details');                      // free-text block printed on invoice
            $table->boolean('is_default')->default(false);
            $table->string('status')->default('active'); // active | inactive
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
