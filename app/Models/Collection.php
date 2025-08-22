<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Collection extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'thumbnail_path',
        'name',
        'slug',
        'description',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)
                ->timezone(config('app.timezone'))
                ->format('d.m.Y H:i'),
        );
    }

    public function panels(): HasMany
    {
        return $this->hasMany(Panel::class)
            ->orderBy('sort');
    }

    #[Scope]
    protected function owner(Builder $query): Builder
    {
        return $query->where('user_id', auth()->id());
    }
}
