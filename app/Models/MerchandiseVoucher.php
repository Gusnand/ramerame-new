<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchandiseVoucher extends Model
{
    protected $table = 'merchandise_vouchers';
    protected $fillable = [
        'voucher_code',
        'voucher_hash_id',
        'merchandise_id',
        'merchant_id',
        'start_date',
        'end_date',
        'user_id',
        'redeem_at',
        'claimed_at',
        'expired_date',
        'status',
        'created_by',
        'updated_by'
    ];

    public function merchandise()
    {
        return $this->belongsTo(Merchandise::class);
    }

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
