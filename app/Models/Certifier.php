<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certifier extends Model
{
  protected $table = 'certifiers';
  public $timestamps = false;
  protected $fillable = ['certificate_id', 'status', 'email_sent_at', 'user_id', 'name', 'address', 'email', 'total_slot', 'slot_price', 'certificate_no', 'created_at', 'updated_at', 'created_by', 'updated_by'];

  public function header()
  {
    return $this->belongsTo(Certificate::class, 'certificate_id', 'id');
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
