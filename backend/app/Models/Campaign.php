<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Traits\BelongsToUser;

class Campaign extends Model
{
    use HasFactory, BelongsToUser;

    protected $fillable = [
        'name',
        'description',
        'status',
        'user_id',
        'difficulty_level',
        'attack_type',
        'adaptation_params',
        'rl_enabled',
        'target_departments',
        'target_contacts',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'adaptation_params' => 'array',
        'target_departments' => 'array',
        'target_contacts' => 'array',
        'rl_enabled' => 'boolean',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function behavioralEvents(): HasMany
    {
        return $this->hasMany(BehavioralEvent::class);
    }

    public function emailClicks(): HasMany
    {
        return $this->hasMany(EmailClick::class);
    }

    public function rlPolicy(): HasOne
    {
        return $this->hasOne(RLPolicy::class);
    }

    public function metrics(): HasOne
    {
        return $this->hasOne(CampaignMetrics::class);
    }

    public function sentPhishingEmails(): HasMany
    {
        return $this->hasMany(SentPhishingEmail::class);
    }
}
