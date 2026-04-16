<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SentPhishingEmail extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'contact_id',
        'subject',
        'content_html',
        'tracking_token',
        'status',
        'opened_at',
        'clicked_at',
        'reported_at',
    ];

    protected $casts = [
        'opened_at' => 'datetime',
        'clicked_at' => 'datetime',
        'reported_at' => 'datetime',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
