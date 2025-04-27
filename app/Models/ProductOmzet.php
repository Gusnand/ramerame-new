<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductOmzet extends Model
{
  use SoftDeletes;

  protected $table = 'product_omzet';
  protected $dates = ['deleted_at'];

  protected $fillable = [
    'product_id',
    'omzet_id',
    'product_omzet_name',
    'status',
    'created_at',
    'updated_at',
    'deleted_at'
  ];
  public $timestamps = false;
}
