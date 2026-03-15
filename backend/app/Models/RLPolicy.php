<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RLPolicy extends Model
{
    use HasFactory;

    protected $table = 'rl_policies';

    protected $fillable = [
        'campaign_id',
        'campaign_params',
        'rewards',
        'state',
    ];

    protected $casts = [
        'campaign_params' => 'array',
        'state' => 'array',
        'rewards' => 'float',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
