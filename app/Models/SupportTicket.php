<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    protected $table = 'support_tickets';
    public $timestamps = false;
    protected $fillable = ['ticket_hash', 'title', 'category', 'user_id', 'priority', 'created_at', 'updated_at', 'is_closed', 'closed_at', 'status'];

    public function support_ticket_details()
    {
        return $this->hasMany(SupportTicketDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
