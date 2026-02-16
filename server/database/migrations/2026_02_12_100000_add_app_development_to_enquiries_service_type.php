<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite doesn't enforce enum constraints, so this only matters for MySQL.
        // For MySQL: alter the enum column to include 'app-development'.
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE enquiries MODIFY COLUMN service_type ENUM(
                'web-development',
                'machine-integration',
                'ai-pipelines',
                'pcb-designing',
                'app-development',
                'rd-consultancy',
                'general'
            ) NOT NULL");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE enquiries MODIFY COLUMN service_type ENUM(
                'web-development',
                'machine-integration',
                'ai-pipelines',
                'pcb-designing',
                'rd-consultancy',
                'general'
            ) NOT NULL");
        }
    }
};
