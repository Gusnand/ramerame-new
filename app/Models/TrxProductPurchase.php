<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrxProductPurchase extends Model
{
  protected $table = 'trx_product_purchases';
  protected $fillable = ['transaction_date', 'purchase_id', 'purchase_hash', 'product_id', 'user_id', 'amount', 'platform_fee', 'ec_unit', 'ec_rate', 'is_deleted', 'created_at', 'updated_at', 'product_insurance_id', 'pct_insurance', 'amt_insurance'];
  public $timestamps = false;

  public function master()
  {
    return $this->belongsTo(TrxProductPurchaseMaster::class, 'purchase_id', 'id');
  }

  public function product()
  {
    return $this->belongsTo(Product::class);
  }

  public function productInsurance()
  {
    return $this->belongsTo(ProductInsurance::class, 'product_insurance_id', 'id');
  }
}
