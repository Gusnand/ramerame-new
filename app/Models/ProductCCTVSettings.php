<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCCTVSettings extends Model
{
  protected $table = 'product_cctv_settings';
  public $timestamps = false;
  protected $fillable = ['product_id', 'cctv_username', 'cctv_password', 'cctv_cloud_serial', 'cctv_name', 'cctv_android_app', 'cctv_ios_app', 'guidance', 'attachment', 'created_at', 'updated_at'];
}
