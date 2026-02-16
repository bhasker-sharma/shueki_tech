<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@shuekitech.com')],
            [
                'name' => env('ADMIN_NAME', 'Admin'),
                'password' => \Illuminate\Support\Facades\Hash::make(env('ADMIN_PASSWORD', 'admin123')),
                'is_admin' => true,
            ]
        );
    }
}
