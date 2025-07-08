<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductDocument extends Model
{
  protected $table = 'product_documents';
  protected $fillable = [
    'product_id',
    'docname',
    'description',
    'created_at',
    'updated_at'
  ];
  public $timestamps = false;
}
