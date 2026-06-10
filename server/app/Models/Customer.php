<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'company',
        'address', 'city', 'gst_number', 'notes', 'status',
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function enquiries()
    {
        return $this->hasMany(Enquiry::class);
    }
}
