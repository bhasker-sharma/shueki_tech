<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'client',
        'industry',
        'service_type',
        'problem',
        'result',
        'tech',
        'images',
        'featured',
        'year',
        'status',
        'gradient',
        'sort_order',
        'link',
    ];

    protected $casts = [
        'tech'     => 'array',
        'images'   => 'array',
        'featured' => 'boolean',
        'year'     => 'integer',
    ];
}
