<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToUser;

class EmailTemplate extends Model
{
    use HasFactory, BelongsToUser;

    protected $fillable = [
        'user_id',
        'name',
        'subject',
        'content_html',
        'category',
        'difficulty_level'
    ];
}
