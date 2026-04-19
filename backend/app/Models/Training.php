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
        'training_module_id',
        'status',
        'assigned_at',
        'completed_at',
        'email_opened_at',
        'score',
        'ai_content',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'completed_at' => 'datetime',
        'email_opened_at' => 'datetime',
        'score' => 'float',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
