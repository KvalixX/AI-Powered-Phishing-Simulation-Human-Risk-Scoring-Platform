<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToUser
{
    protected static function bootBelongsToUser()
    {
        // Automatically set user_id when creating a new model instance
        static::creating(function ($model) {
            if (Auth::check() && !$model->user_id) {
                $model->user_id = Auth::id();
            }
        });

        // Add a global scope to filter all queries by user_id
        static::addGlobalScope('user_id', function (Builder $builder) {
            if (Auth::check()) {
                $builder->where('user_id', Auth::id());
            }
        });
    }

    /**
     * Scope a query to only include system-wide data (where user_id is null)
     * or data belonging to the current user.
     */
    public function scopeWithGlobal(Builder $query)
    {
        return $query->withoutGlobalScope('user_id');
    }
}
