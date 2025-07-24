<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductNotice extends Model
{
    protected $table = 'product_notices';
    public $timestamps = false;
    protected $fillable = [
        'product_id',
        'title',
        'content',
        'notice_date',
        'created_at',
        'updated_at',
        'created_by',
        'period_group',
        'has_attachment',
        'attachment',
        'path',
        'is_global'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
