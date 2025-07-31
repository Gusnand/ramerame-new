<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchandiseImage extends Model
{
    protected $table = 'merchandise_images';
    protected $fillable = [
        'path',
        'file',
        'type',
        'merchandise_id'
    ];
    protected $visible = [
        'id',
        'path',
        'file',
    ];

    public function merchandise()
    {
        return $this->belongsTo(Merchandise::class);
    }
}
