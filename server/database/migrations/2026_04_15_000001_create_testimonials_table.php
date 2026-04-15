<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('company');
            $table->text('text');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->string('service')->nullable();
            $table->string('initials', 3);
            $table->string('gradient')->default('from-blue-500 to-cyan-500');
            $table->boolean('featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->string('status')->default('published');
            $table->timestamps();

            $table->index('status');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
