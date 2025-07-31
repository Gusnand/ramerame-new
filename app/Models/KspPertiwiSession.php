<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KspPertiwiSession extends Model
{
    protected $table = 'ksp_pertiwi_sessions';
    protected $guarded = [];

    public function user_infos()
    {
        return $this->belongsTo(UserInfo::class);
    }
}
