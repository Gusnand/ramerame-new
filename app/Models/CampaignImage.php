<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignImage extends Model
{
    protected $table = 'campaign_images';
    protected $fillable = [
        'path',
        'file',
        'campaign_id'
    ];
    protected $visible = [
        'id',
        'path',
        'file'
    ];
}
