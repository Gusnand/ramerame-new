<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    protected $table = 'merchants';
    protected $fillable = ['id', 'merchant_name', 'address', 'phone', 'logo', 'website', 'description', 'is_active', 'embed_map'];

    public function merchant_category()
    {
        return $this->belongsTo('App\MerchantCategory');
    }

    public function campaigns()
    {
        return $this->hasMany('App\Campaign');
    }

    public function merchandises()
    {
        return $this->hasMany('App\Merchandise');
    }

    public function contacts()
    {
        return $this->hasMany('App\MerchantContact');
    }

    public function merchant_user()
    {
        return $this->belongsToMany('App\User', 'merchant_users', 'merchant_id', 'user_id');
    }
}
