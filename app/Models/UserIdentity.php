<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserIdentity extends Model
{
    protected $table = 'user_identities';
    protected $fillable = [
        'history_no',
        'user_id',
        'identity_type',
        'identity_no',
        'capital_value',
        'npwp_no',
        'id_image',
        'image_with_id',
        'npwp_image',
        'approved',
        'effective_start_date',
        'effective_end_date'
    ];
    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function detail_user_identities()
    {
        return $this->hasOne('App\DetailUserIdentity');
    }
}
