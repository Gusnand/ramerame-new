<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignVoucher extends Model
{
    protected $table = 'campaign_vouchers';
    protected $fillable = [
        'id',
        'voucher_code',
        'voucher_hash_id',
        'campaign_id',
        'merchant_id',
        'start_date',
        'end_date',
        'is_claimed',
        'user_id',
        'redeem_with',
        'redeem_at',
        'status',
        'created_by',
        'updated_by',
        'claimed_at',
        'expired_date',
        'claimed_at'
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
