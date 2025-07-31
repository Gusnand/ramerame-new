<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    protected $table = 'user_infos';
    protected $fillable = [
        'history_no',
        'avatar',
        'user_id',
        'sex_type',
        'phone_no',
        'province_id',
        'district_id',
        'born_date',
        'subdistrict_id',
        'village_id',
        'address',
        'zipcode',
        'approved',
        'effective_start_date',
        'effective_end_date'
    ];
    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function user_infos()
    {
        return $this->hasMany(UserInfo::class);
    }

    public function detail_user_infos()
    {
        return $this->hasOne(DetailUserInfo::class);
    }

    public function ksp_pertiwi_session()
    {
        return $this->hasOne(KspPertiwiSession::class);
    }

    public function province()
    {
        return $this->hasOne(Province::class, 'id', 'province_id');
    }

    public function district()
    {
        return $this->hasOne(District::class, 'id', 'district_id');
    }

    public function subdistrict()
    {
        return $this->hasOne(Subdistrict::class, 'id', 'subdistrict_id');
    }

    public function village()
    {
        return $this->hasOne(Village::class, 'id', 'village_id');
    }
}
