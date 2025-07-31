<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductInsurance extends Model
{
    protected $table = 'product_insurances';
    protected $fillable = [
        'id',
        'product_id',
        'insurance_id',
        'percentage',
        'document',
        'title',
        'description',
        'created_at',
        'updated_at'
    ];
    public $timestamps = false;
    protected $primaryKey = 'id';

    public function insurance()
    {
        return $this->belongsTo(Insurance::class, 'insurance_id', 'id');
    }
}
