<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleLog extends Model
{
    protected $table="sale_logs";
    protected $fillable = [
        "product_name",
        "product_type",
        "sale_price",
        "total_price",
        "order_status",
        "customer_name",
        "customer_cellphone",
        "customer_email",
        "customer_address",
        "description"
    ];
}
