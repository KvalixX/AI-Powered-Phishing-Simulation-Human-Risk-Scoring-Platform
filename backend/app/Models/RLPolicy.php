<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\BelongsToUser;

class RLPolicy extends Model
{
    use HasFactory, BelongsToUser;

    protected $table = 'rl_policies';

    protected $fillable = [
        'user_id',
        'campaign_id',
        'contact_id',
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

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
