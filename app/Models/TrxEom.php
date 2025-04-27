<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrxEom extends Model
{
  use HasFactory;
  protected $table = 'trx_eom';
  public $timestamps = false;
  protected $fillable = ['product_id', 'upload_date', 'process_date', 'approved_date', 'status', 'created_by', 'created_at', 'attachment', 'amount', 'modified_by', 'manager_id', 'period_month', 'period_year', 'modified_at', 'title'];
}
