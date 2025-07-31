<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignInvoice extends Model
{
    protected $table = 'campaign_invoices';
    protected $fillable = [
        'fee',
        'fee_type',
        'voucher_used',
        'total',
        'status',
        'is_paid',
        'path',
        'filename',
        'campaign_id',
        'created_by',
        'updated_by',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
