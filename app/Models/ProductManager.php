<?php

namespace App\Models;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class ProductManager extends Model
{
    protected $table = 'product_managers';

    protected $fillable = [
        'product_id',
        'user_id',
        'status',
        'created_at',
        'updated_at',
        'deleted_at',
        'is_deleted',
        'created_by'
    ];

    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
