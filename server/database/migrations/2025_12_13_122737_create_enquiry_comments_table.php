<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enquiry_comments', function (Blueprint $table) {
            $table->id();
            $table->string('enquiry_type'); // 'contact' or 'quote'
            $table->unsignedBigInteger('enquiry_id');
            $table->text('comment');
            $table->unsignedBigInteger('user_id'); // Admin who commented
            $table->timestamps();

            $table->index(['enquiry_type', 'enquiry_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enquiry_comments');
    }
};
