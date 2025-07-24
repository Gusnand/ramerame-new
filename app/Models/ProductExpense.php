<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductExpense extends Model
{
    protected $table = 'product_expenses';
    protected $fillable = [
        'expense_type_id',
        'manager_id',
        'expense_name',
        'description',
        'amount',
        'status',
        'expense_date',
        'product_id',
        'file_path',
        'file_name',
        'is_deleted',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
