<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->enum('service_type', [
                'web-development',
                'machine-integration',
                'ai-pipelines',
                'pcb-designing',
                'app-development',
                'rd-consultancy',
                'general',
            ]);
            $table->text('message');
            $table->enum('status', ['new', 'read', 'closed'])->default('new');
            $table->string('ip_address')->nullable();
            $table->timestamps();

            $table->index('service_type');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};
