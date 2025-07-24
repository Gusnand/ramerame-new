<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignLog extends Model
{
    protected $table = 'campaign_logs';
    protected $fillable = [
        'id',
        'campaign_id',
        'remark',
        '
        frm_campaign_status',
        'to_campaign_status',
        'created_by',
        'created_at'
    ];
    public $timestamps = false;
}
