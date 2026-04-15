<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->text('answer');
            $table->string('page', 60);   // home | contact | web-development | etc.
            $table->integer('sort_order')->default(0);
            $table->string('status')->default('published');
            $table->timestamps();

            $table->index('page');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
