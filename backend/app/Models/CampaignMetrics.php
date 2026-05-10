<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\BelongsToUser;

class CampaignMetrics extends Model
{
    use HasFactory, BelongsToUser;

    protected $fillable = [
        'user_id',
        'campaign_id',
        'ctr',
        'precision',
        'auc_roc',
        'statistical_tests',
    ];

    protected $casts = [
        'ctr' => 'float',
        'precision' => 'float',
        'auc_roc' => 'float',
        'statistical_tests' => 'array',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
