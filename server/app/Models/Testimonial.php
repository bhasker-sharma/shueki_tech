<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'role',
        'company',
        'text',
        'rating',
        'service',
        'initials',
        'gradient',
        'featured',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'rating'     => 'integer',
        'featured'   => 'boolean',
        'sort_order' => 'integer',
    ];
}
