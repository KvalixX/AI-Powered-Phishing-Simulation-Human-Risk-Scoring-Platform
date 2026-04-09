<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'email',
        'first_name',
        'last_name',
        'department',
        'position',
        'seniority',
        'language',
        'training_history',
    ];

    protected $casts = [
        'training_history' => 'array',
    ];

    public function riskScore(): HasOne
    {
        return $this->hasOne(UserRiskScore::class);
    }

    public function behavioralEvents(): HasMany
    {
        return $this->hasMany(BehavioralEvent::class);
    }

    public function trainings(): HasMany
    {
        return $this->hasMany(Training::class);
    }

    public function emailClicks(): HasMany
    {
        return $this->hasMany(EmailClick::class);
    }
}
