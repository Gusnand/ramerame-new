<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    protected $table = 'merchants';
    protected $fillable = ['id', 'merchant_name', 'address', 'phone', 'logo', 'website', 'description', 'is_active', 'embed_map'];

    public function merchant_category()
    {
        return $this->belongsTo(MerchantCategory::class);
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }

    public function merchandises()
    {
        return $this->hasMany(Merchandise::class);
    }

    public function contacts()
    {
        return $this->hasMany(MerchantContact::class);
    }

    public function merchant_user()
    {
        return $this->belongsToMany(User::class, 'merchant_users', 'merchant_id', 'user_id');
    }
}
