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
        Schema::table('contacts', function (Blueprint $table) {
            $table->enum('status', ['new', 'read', 'closed'])->default('new')->after('message');
        });

        Schema::table('quotes', function (Blueprint $table) {
            $table->enum('status', ['new', 'read', 'closed'])->default('new')->after('project_details');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
