<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'company_name', 'tagline', 'address', 'city',
        'phone', 'email', 'website', 'gst_number',
    ];
}
