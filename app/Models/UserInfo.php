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
        return $this->belongsTo('App\User');
    }

    public function user_infos()
    {
        return $this->hasMany('App\UserInfo');
    }

    public function detail_user_infos()
    {
        return $this->hasOne('App\DetailUserInfo');
    }

    public function ksp_pertiwi_session()
    {
        return $this->hasOne('App\KspPertiwiSession');
    }

    public function province()
    {
        return $this->hasOne('App\Province', 'id', 'province_id');
    }

    public function district()
    {
        return $this->hasOne('App\District', 'id', 'district_id');
    }

    public function subdistrict()
    {
        return $this->hasOne('App\Subdistrict', 'id', 'subdistrict_id');
    }

    public function village()
    {
        return $this->hasOne('App\Village', 'id', 'village_id');
    }
}
