<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    protected $fillable = [
        'quotation_number', 'customer_id', 'payment_method_id',
        'customer_name', 'customer_email', 'customer_phone', 'customer_company',
        'title', 'status', 'issue_date', 'valid_until', 'currency', 'notes',
        'subtotal', 'tax_percent', 'tax_amount', 'total',
    ];

    protected $casts = [
        'issue_date'  => 'date:Y-m-d',
        'valid_until' => 'date:Y-m-d',
        'subtotal'    => 'float',
        'tax_percent' => 'float',
        'tax_amount'  => 'float',
        'total'       => 'float',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function items()
    {
        return $this->hasMany(QuotationItem::class)->orderBy('sort_order');
    }

    public function sections()
    {
        return $this->hasMany(QuotationSection::class)->orderBy('sort_order');
    }
}
