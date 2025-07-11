<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\DailySalesReport;
use App\Models\ProductCategory;
use App\Models\ProductDocument;
use App\Models\TrxEom;
use App\Models\ProductCCTVSettings;
use App\Models\Bank;

class Product extends Model
{
    protected $table = 'products';
    protected $fillable = [
        'id',
        'product_category_id',
        'product_name',
        'product_slug',
        'content',
        'status',
        'expired_date',
        'invest_month',
        'invest_amount',
        'ec_unit',
        'ec_unit_remaining',
        'ec_rate',
        'invest_remaining_amount',
        'longitude',
        'latitude',
        'address',
        'embedmap',
        'flag',
        'created_at',
        'updated_at',
        'deleted_at',
        'term',
        'termfile',
        'exclusive_for',
        'exclusive_until',
        'visibility',
        'max_slot',
        'platform_fee',
        'insurance_id',
        'bank_id',
        'account_no',
        'on_behalf_of',
        'is_allow_payroll'
    ];
    public $timestamps = false;

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    // public function product_category()
    // {
    //     return $this->belongsTo('App\Models\ProductCategory');
    // }

    public function product_images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function product_expenses()
    {
        return $this->hasMany('App\ProductExpense');
    }

    public function product_omzets()
    {
        return $this->hasMany('App\ProductOmzet');
    }

    public function trxEoms()
    {
        return $this->hasMany(TrxEom::class, 'product_id');
    }

    public function daily_sales_reports()
    {
        return $this->hasMany(DailySalesReport::class, 'product_id');
    }

    // public function product_cctvs()
    // {
    //     return $this->hasMany('App\Models\ProductCCTVSettings');
    // }

    public function product_cctvs()
    {
        return $this->hasMany(ProductCCTVSettings::class);
    }

    public function product_documents()
    {
        return $this->hasMany(ProductDocument::class);
    }

    public function notices()
    {
        return $this->hasMany('App\ProductNotice');
    }

    public function product_insurances()
    {
        return $this->hasMany(ProductInsurance::class, 'id', 'product_id');
    }

    // public function bank()
    // {
    //     return $this->hasOne('App\Models\Bank', 'id', 'bank_id');
    // }

    public function bank()
    {
        return $this->belongsTo(Bank::class, 'bank_id');
    }

    public function insurances()
    {
        return $this->belongsTo(Insurance::class, 'insurance_id');
    }
}
