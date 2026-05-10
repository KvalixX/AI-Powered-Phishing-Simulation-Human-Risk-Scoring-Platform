<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\BelongsToUser;

class EmailClick extends Model
{
    use HasFactory, BelongsToUser;

    protected $fillable = [
        'user_id',
        'contact_id',
        'campaign_id',
        'ip_address',
        'user_agent',
        'reaction_time',
        'time_of_day',
        'day_of_week',
    ];

    protected $casts = [
        'reaction_time' => 'integer',
        'day_of_week' => 'integer',
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
