<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailySalesReport extends Model
{

    protected $table = 'daily_sales_reports';
    protected $fillable = [
        'sales_date',
        'product_id',
        'manager_id',
        'product_omzet_id',
        'omzet_id',
        'omzet_name',
        'omzet_percentage',
        'file_path',
        'file_name',
        'sales_amount',
        'amount_calculated',
        'status',
        'is_deleted',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class, 'id');
    }


}
