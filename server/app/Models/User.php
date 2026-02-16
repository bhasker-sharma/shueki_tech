<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'role',
        'permissions',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'permissions' => 'array',
        ];
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission($permission)
    {
        // Super admin from .env has all permissions
        if ($this->email === config('app.super_admin_email')) {
            return true;
        }

        // Check if user has the specific permission
        if ($this->permissions && in_array($permission, $this->permissions)) {
            return true;
        }

        // Role-based permissions
        $rolePermissions = [
            'super_admin' => ['*'], // All permissions
            'admin' => ['view_dashboard', 'manage_contacts', 'manage_quotes', 'manage_blogs', 'view_users'],
            'editor' => ['view_dashboard', 'manage_blogs'],
            'viewer' => ['view_dashboard'],
        ];

        if (isset($rolePermissions[$this->role])) {
            return in_array('*', $rolePermissions[$this->role]) ||
                   in_array($permission, $rolePermissions[$this->role]);
        }

        return false;
    }

    /**
     * Check if user is super admin
     */
    public function isSuperAdmin()
    {
        return $this->email === config('app.super_admin_email') || $this->role === 'super_admin';
    }
}
