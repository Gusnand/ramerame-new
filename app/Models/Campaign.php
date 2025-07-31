<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $table = 'campaigns';
    protected $fillable = [
        'id',
        'campaign_name',
        'campaign_category_id',
        'merchant_id',
        'description',
        'number_of_points',
        'voucher_price',
        'image_path',
        'image_file',
        'status',
        'is_published',
        'created_at',
        'number_of_voucher',
        'status_req_publish',
        'voucher_period_id',
        'voucher_price_before',
        'is_highlighted',
        'point_multipler'
    ];

    public function campaign_category()
    {
        return $this->belongsTo(CampaignCategory::class);
    }

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function campaign_voucher()
    {
        return $this->hasMany(CampaignVoucher::class);
    }

    public function campaign_log()
    {
        return $this->hasMany(CampaignLog::class);
    }

    public function voucher_period()
    {
        return $this->belongsTo(VoucherPeriod::class);
    }

    public function images()
    {
        return $this->hasMany(CampaignImage::class);
    }

    public function invoices()
    {
        return $this->hasOne(CampaignInvoice::class);
    }
}
