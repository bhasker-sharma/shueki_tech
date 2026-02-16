<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnquiryComment extends Model
{
    protected $fillable = [
        'enquiry_type',
        'enquiry_id',
        'comment',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
