<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Insurance extends Model
{
    protected $table = 'insurances';
    protected $fillable = [
        'id',
        'name',
        'description',
        'logo',
        'acronym'
    ];
    public $timestamps = false;

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
