<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $table = 'districts';
    public $timestamps = false;

    public function subdistricts()
    {
        return $this->hasMany(Subdistrict::class);
    }

    public function villages()
    {
        return $this->hasManyThrough(Village::class, Subdistrict::class);
    }
}
