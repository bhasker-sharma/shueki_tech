<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE enquiries MODIFY COLUMN service_type ENUM(
                'desktop-applications',
                'web-dashboards',
                'edge-integration',
                'general',
                'web-development',
                'machine-integration',
                'ai-pipelines',
                'pcb-designing',
                'app-development',
                'rd-consultancy'
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
                'app-development',
                'rd-consultancy',
                'general'
            ) NOT NULL");
        }
    }
};
