<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    protected $table = 'villages';
    public $timestamps = false;

    public function subdistrict()
    {
        return $this->belongsTo(Subdistrict::class);
    }
}
