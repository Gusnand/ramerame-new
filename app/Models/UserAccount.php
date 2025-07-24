<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAccount extends Model
{
    protected $table = 'user_bank_accounts';
    protected $fillable = [
        'bank_id',
        'user_id',
        'account_owner',
        'bank_branch',
        'account_numbers',
        'approved',
        'effective_start_date',
        'effective_end_date'
    ];
    public $timestamps = false;
}
