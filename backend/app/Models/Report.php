<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'date',
        'status',
        'size',
        'author_id',
        'file_path'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
