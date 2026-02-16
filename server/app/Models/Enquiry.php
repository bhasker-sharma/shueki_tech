<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'company',
        'service_type',
        'message',
        'status',
        'ip_address',
    ];

    public function comments()
    {
        return $this->hasMany(EnquiryComment::class, 'enquiry_id')
            ->where('enquiry_type', 'enquiry');
    }
}
