<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\BelongsToUser;

class BehavioralEvent extends Model
{
    use HasFactory, BelongsToUser;

    protected $fillable = [
        'user_id',
        'contact_id',
        'campaign_id',
        'event_type',
        'reaction_time',
        'device',
        'ip_address',
        'context',
        'event_timestamp',
    ];

    protected $casts = [
        'context' => 'array',
        'reaction_time' => 'integer',
        'event_timestamp' => 'datetime',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
