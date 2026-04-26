<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToUser;

class TrainingModule extends Model
{
    use HasFactory, BelongsToUser;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'duration',
        'difficulty',
        'icon',
        'is_ai_recommended'
    ];
}
