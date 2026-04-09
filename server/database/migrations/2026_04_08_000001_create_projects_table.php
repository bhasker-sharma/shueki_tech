<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('client')->default('Anonymous');
            $table->string('industry');
            $table->string('service_type');
            $table->text('problem');
            $table->text('result');
            $table->json('tech')->nullable();
            $table->json('images')->nullable(); // relative paths e.g. ["projects/1/img.jpg"]
            $table->boolean('featured')->default(false);
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('status')->default('published'); // draft | published
            $table->string('gradient')->default('from-blue-500 to-cyan-500');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
