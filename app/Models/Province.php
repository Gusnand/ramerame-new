<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $table = 'provinces';
    public $timestamps = false;

    public function districts()
    {
        return $this->hasMany(District::class);
    }

    public function user_info()
    {
        return $this->belongsTo(UserInfo::class, 'province_id', 'id');
    }
}
