<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $table = 'vouchers';
    protected $fillable = [
        'voucher_code',
        'quantity',
        'amount',
        'amount_type',
        'start_date',
        'end_date',
        'image_url',
        'description',
        'event',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
        'published'
    ];
    public $timestamps = false;

    public function details()
    {
        return $this->hasMany(VoucherDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
