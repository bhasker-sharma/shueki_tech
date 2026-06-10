<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_number', 'customer_id', 'project_name', 'status',
        'issue_date', 'due_date', 'notes',
        'subtotal', 'tax_percent', 'tax_amount', 'total',
    ];

    protected $casts = [
        'issue_date'  => 'date:Y-m-d',
        'due_date'    => 'date:Y-m-d',
        'subtotal'    => 'float',
        'tax_percent' => 'float',
        'tax_amount'  => 'float',
        'total'       => 'float',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class)->orderBy('sort_order');
    }
}
