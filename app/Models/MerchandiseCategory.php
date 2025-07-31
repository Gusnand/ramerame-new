<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchandiseCategory extends Model
{
    protected $table = 'merchandise_categories';
    protected $fillable = [
        'category',
        'icon_name',
        'is_active',
        'created_by',
        'updated_by',
    ];
}
