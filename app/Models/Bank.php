<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bank extends Model
{
  protected $table = 'banks';
  public $timestamps = false;
  protected $fillable = ['bank_code', 'bank_name', 'bank_description'];

  public function bankAccount(): HasMany
  {
    return $this->hasMany(Product::class, 'bank_id', 'id');
  }
}
