<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VoucherDetail extends Model
{
    protected $table = 'voucher_details';
    protected $fillable = [
        'user_id',
        'voucher_id',
        'claimed_at',
        'amount',
        'status',
        'blocked_reason',
        'blocked_by',
        'blocked_at'
    ];
    public $timestamps = false;

    public function master()
    {
        return $this->belongsTo(Voucher::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }
}
