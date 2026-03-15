<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserRiskScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'contact_id',
        'score',
        'level',
        'features',
        'confidence',
        'last_updated',
    ];

    protected $casts = [
        'features' => 'array',
        'score' => 'float',
        'confidence' => 'float',
        'last_updated' => 'datetime',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
