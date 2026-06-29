<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuotationSection extends Model
{
    protected $fillable = [
        'quotation_id', 'type', 'title', 'content', 'sort_order',
    ];
}
