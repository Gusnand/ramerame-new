<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductCategory extends Model
{
    protected $table = 'product_categories';
    public $timestamps = true;
    protected $fillable = ['category_name'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'product_category_id');
    }

    // public function products()
    // {
    //     return $this->hasMany('App\Models\Product');
    // }
}
