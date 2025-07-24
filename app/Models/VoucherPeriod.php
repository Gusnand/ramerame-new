<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VoucherPeriod extends Model
{
    protected $table = 'voucher_periods';
    protected $fillable = [
        'period',
        'unit',
        'display'
    ];
}
