<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchantContact extends Model
{
    protected $table = 'merchant_contacts';
    protected $fillable = ['id', 'merchant_id', 'name', 'phone', 'role'];
    public $timestamps = false;
}
