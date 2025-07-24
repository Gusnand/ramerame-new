<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTerm extends Model
{
    protected $table = 'user_terms';
    protected $fillable = ['term_id', 'user_id', 'is_accept'];
}
