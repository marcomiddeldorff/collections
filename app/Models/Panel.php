<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Panel extends Model
{
    protected $fillable = [
        'collection_id',
        'name',
        'sort',
        'visibility',
    ];

    protected function casts(): array
    {
        return [
            'visibility' => 'json'
        ];
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function fields(): HasMany
    {
        return $this->hasMany(Field::class);
    }
}
