<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignCategory extends Model
{
    protected $table = 'campaign_categories';
    protected $fillable = ['id', 'category', 'icon_name', 'is_active'];

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }
}
