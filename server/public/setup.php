<?php
/**
 * One-Time Setup Script for Hostinger
 *
 * IMPORTANT: Delete this file after running once!
 * Access: https://yourdomain.com/setup.php?key=shueki-setup-14268cf933aea6f6
 */

// Security check
$setupKey = $_GET['key'] ?? '';
$requiredKey = 'shueki-setup-14268cf933aea6f6'; // From .env SETUP_KEY

if ($setupKey !== $requiredKey) {
    die('❌ Unauthorized access. Invalid setup key.');
}

echo "<h1>🚀 Shueki Tech Website Setup</h1>";
echo "<pre>";

// Load Laravel
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "✓ Laravel loaded\n\n";

// Check database connection
echo "📊 Testing database connection...\n";
try {
    DB::connection()->getPdo();
    echo "✓ Database connected successfully!\n";
    echo "   Database: " . config('database.connections.mysql.database') . "\n";
    echo "   Host: " . config('database.connections.mysql.host') . "\n\n";
} catch (\Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n\n";
    die("Please check your .env database credentials.");
}

// Run migrations
echo "📋 Running migrations...\n";
try {
    Artisan::call('migrate', ['--force' => true]);
    echo Artisan::output();
    echo "✓ Migrations completed\n\n";
} catch (\Exception $e) {
    echo "❌ Migration error: " . $e->getMessage() . "\n\n";
}

// Create admin user
echo "👤 Creating admin user...\n";
try {
    $adminEmail = config('app.super_admin_email');
    $adminName = env('ADMIN_NAME', 'Admin');
    $adminPassword = env('ADMIN_PASSWORD', 'ShuekiTech@2025');

    // Check if admin exists
    $existingAdmin = App\Models\User::where('email', $adminEmail)->first();

    if ($existingAdmin) {
        echo "⚠ Admin user already exists: {$adminEmail}\n\n";
    } else {
        $admin = App\Models\User::create([
            'name' => $adminName,
            'email' => $adminEmail,
            'password' => Hash::make($adminPassword),
            'role' => 'super_admin',
            'is_admin' => true,
            'permissions' => [],
        ]);

        echo "✓ Admin user created:\n";
        echo "   Email: {$adminEmail}\n";
        echo "   Password: {$adminPassword}\n\n";
    }
} catch (\Exception $e) {
    echo "❌ Admin creation error: " . $e->getMessage() . "\n\n";
}

// Create storage link
echo "📁 Creating storage link...\n";
try {
    Artisan::call('storage:link');
    echo Artisan::output();
    echo "✓ Storage link created\n\n";
} catch (\Exception $e) {
    echo "⚠ Storage link warning: " . $e->getMessage() . "\n";
    echo "(This is normal if link already exists)\n\n";
}

// Clear caches
echo "🧹 Clearing caches...\n";
Artisan::call('config:cache');
Artisan::call('route:cache');
echo "✓ Caches cleared and rebuilt\n\n";

echo "</pre>";

echo "<div style='background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; margin: 20px 0; border-radius: 5px;'>";
echo "<h2 style='color: #155724; margin: 0 0 10px 0;'>✅ Setup Complete!</h2>";
echo "<p style='color: #155724; margin: 0;'><strong>IMPORTANT:</strong> Delete this file now for security!</p>";
echo "<p style='color: #155724; margin: 10px 0 0 0;'>File to delete: <code>public/setup.php</code></p>";
echo "</div>";

echo "<p><a href='/admin' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>→ Go to Admin Panel</a></p>";
