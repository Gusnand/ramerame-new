<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailUserIdentity extends Model
{
    //
    protected $table = 'detail_users_identities';
    protected $guarded = [];

    public function user_identities()
    {
        return $this->belongsTo(UserIdentity::class);
    }
}
