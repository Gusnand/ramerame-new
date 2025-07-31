<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailUserInfo extends Model
{
    //
    protected $table = 'detail_users_infos';
    protected $guarded = [];

    public function user_infos()
    {
        return $this->belongsTo(UserInfo::class);
    }

    public function provinces()
    {
        return $this->belongsTo(Province::class);
    }

    public function districts()
    {
        return $this->belongsTo(District::class);
    }

    public function subdistricts()
    {
        return $this->belongsTo(Subdistrict::class);
    }

    public function villages()
    {
        return $this->belongsTo(Village::class);
    }
}
