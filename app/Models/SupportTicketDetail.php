<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTicketDetail extends Model
{
    protected $table = 'support_ticket_details';
    public $timestamps = false;
    protected $fillable = ['support_ticket_id', 'message', 'user_id', 'attachment', 'created_at', 'updated_at', 'status'];
}
