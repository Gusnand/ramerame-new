<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrxProductPurchaseMaster extends Model
{
    protected $table = 'trx_product_purchase_master';
    protected $fillable = ['purchase_date', 'user_id', 'unique_id', 'status', 'referal', 'meta', 'meta_transfer', 'attachment', 'remark', 'is_from_old_app', 'is_online', 'approved_by', 'created_at', 'updated_at', 'is_deleted', 'deleted_at'];
    public $timestamps = false;

    public function trx_product_purchases()
    {
        return $this->hasMany(TrxProductPurchase::class, 'purchase_id', 'id');
    }
}
