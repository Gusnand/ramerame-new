<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subdistrict extends Model
{
    protected $table = 'subdistricts';
    public $timestamps = false;

    public function villages()
    {
        return $this->hasMany(Village::class);
    }
}
