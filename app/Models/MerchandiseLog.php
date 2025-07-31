<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchandiseLog extends Model
{
    protected $table = 'merchandise_logs';
    protected $fillable = [
        'id',
        'merchandise_id',
        'remark',
        'frm_merchandise_status',
        'to_merchandise_status',
        'created_by',
    ];
}
