<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchantCategory extends Model
{
    protected $table = 'merchant_categories';
    protected $fillable = ['id', 'category', 'is_active'];

    public function merchants()
    {
        return $this->hasMany('App\Merchant');
    }
}
