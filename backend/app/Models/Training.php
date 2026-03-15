<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Training extends Model
{
    use HasFactory;

    protected $fillable = [
        'contact_id',
        'type',
        'content',
        'recommended_by',
        'completed',
        'impact',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'impact' => 'float',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
