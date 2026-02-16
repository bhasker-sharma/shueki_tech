<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class SetupController extends Controller
{
    /**
     * FOR SHARED HOSTING: Run migrations and seed admin user
     * Access this ONCE via: yoursite.com/setup?key=YOUR_SETUP_KEY
     * After setup, this route will be disabled automatically
     */
    public function install(Request $request)
    {
        // Security: Check setup key from .env
        $setupKey = env('SETUP_KEY', 'change-this-key-123');

        if ($request->get('key') !== $setupKey) {
            return response()->json([
                'error' => 'Invalid setup key. Set SETUP_KEY in .env file.'
            ], 403);
        }

        // Check if already set up
        $setupFile = storage_path('app/setup_complete.txt');
        if (File::exists($setupFile)) {
            return response()->json([
                'message' => 'Setup already completed!',
                'note' => 'Delete storage/app/setup_complete.txt to run setup again.'
            ]);
        }

        try {
            // Run migrations
            Artisan::call('migrate', ['--force' => true]);
            $migrationOutput = Artisan::output();

            // Seed admin user
            Artisan::call('db:seed', [
                '--class' => 'AdminUserSeeder',
                '--force' => true
            ]);
            $seederOutput = Artisan::output();

            // Mark setup as complete
            File::put($setupFile, 'Setup completed on ' . now());

            return response()->json([
                'success' => true,
                'message' => 'Setup completed successfully!',
                'admin_email' => env('ADMIN_EMAIL', 'admin@shuekitech.com'),
                'admin_password' => 'Check your .env file for ADMIN_PASSWORD',
                'migrations' => $migrationOutput,
                'seeder' => $seederOutput,
                'next_steps' => [
                    '1. Login to admin panel at /admin',
                    '2. Change your admin password',
                    '3. For security: Remove /setup route from routes/web.php'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Setup failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check setup status
     */
    public function status()
    {
        $setupComplete = File::exists(storage_path('app/setup_complete.txt'));

        return response()->json([
            'setup_complete' => $setupComplete,
            'database_path' => database_path('database.sqlite'),
            'database_exists' => File::exists(database_path('database.sqlite')),
        ]);
    }
}
