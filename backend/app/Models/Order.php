<?php

namespace App\Models;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table="orders";
    protected $fillable = [
        "order_number",
        "product_name",
        "product_id",
        "quantity",
        "VAT",
        "product_type",
        "discount_amount",
        "sale_price",
        "total_price",
        "order_status",
        "customer_name",
        "customer_phone",
        "customer_email",
        "customer_address",
        "description"
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
