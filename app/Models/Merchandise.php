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
        return $this->belongsTo(MerchandiseCategory::class);
    }

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function merchandise_voucher()
    {
        return $this->hasMany(MerchandiseVoucher::class);
    }

    public function merchandise_log()
    {
        return $this->hasMany(MerchandiseLog::class);
    }

    public function voucher_period()
    {
        return $this->belongsTo(VoucherPeriod::class);
    }

    public function images()
    {
        return $this->hasMany(MerchandiseImage::class);
    }
}
