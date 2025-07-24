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
        return $this->belongsTo('App\CampaignCategory');
    }

    public function merchant()
    {
        return $this->belongsTo('App\Merchant');
    }

    public function campaign_voucher()
    {
        return $this->hasMany('App\CampaignVoucher');
    }

    public function campaign_log()
    {
        return $this->hasMany('App\CampaignLog');
    }

    public function voucher_period()
    {
        return $this->belongsTo('App\VoucherPeriod');
    }

    public function images()
    {
        return $this->hasMany('App\CampaignImage');
    }

    public function invoices()
    {
        return $this->hasOne('App\CampaignInvoice');
    }
}
