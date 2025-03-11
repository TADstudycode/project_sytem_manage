<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Product extends Model
{
    protected $table = "products";
    protected $fillable = [
        "name",
        "category",
        "product_code",
        "status",
        "import_price",
        "sale_price",
        "image",
        "description",
        "brand",
        "quantity"
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
