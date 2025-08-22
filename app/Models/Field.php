<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Field extends Model
{
    protected $fillable = [
        'panel_id',
        'key',
        'label',
        'type',
        'required',
        'sort',
        'config',
    ];

    protected function casts(): array
    {
        return [
            'config' => 'json',
        ];
    }

    public function panel(): BelongsTo
    {
        return $this->belongsTo(Panel::class);
    }
}
