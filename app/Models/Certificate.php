<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Certifier;
use App\Models\Product;

class Certificate extends Model
{
  protected $table = 'certificates';
  public $timestamps = false;
  protected $fillable = ['product_id', 'cert_prefix', 'template_email', 'attachment1', 'attachment2', 'attachment3', 'attachment4', 'product_name', 'product_location', 'product_duration', 'cert_location', 'cert_date_string', 'cert_date', 'project_owner_company', 'project_owner_name', 'project_owner_title', 'admin_company', 'admin_owner', 'admin_title', 'created_at', 'updated_at', 'created_by', 'updated_by'];

  public function details()
  {
    return $this->hasMany(Certifier::class);
  }

  public function product()
  {
    return $this->belongsTo(Product::class);
  }
}
