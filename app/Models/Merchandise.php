<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merchandise extends Model
{
    protected $table = 'merchandises';
    protected $fillable = [
        'merchandise_name',
        'start_date',
        'end_date',
        'merchandise_category_id',
        'merchant_id',
        'voucher_price',
        'number_of_voucher',
        'description',
        'status',
        'is_published',
        'created_by',
        'updated_by',
        'status_req_publish',
        'voucher_period_id'
    ];

    public function merchandise_category()
    {
        return $this->belongsTo('App\MerchandiseCategory');
    }

    public function merchant()
    {
        return $this->belongsTo('App\Merchant');
    }

    public function merchandise_voucher()
    {
        return $this->hasMany('App\MerchandiseVoucher');
    }

    public function merchandise_log()
    {
        return $this->hasMany('App\MerchandiseLog');
    }

    public function voucher_period()
    {
        return $this->belongsTo('App\VoucherPeriod');
    }

    public function images()
    {
        return $this->hasMany('App\MerchandiseImage');
    }
}
