<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
  protected $table = 'product_images';
  protected $fillable = [
    'product_id',
    'image_path',
    'image_file',
    'created_at',
    'updated_at'
  ];
  public $timestamps = false;
}
