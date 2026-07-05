<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['type', 'amount', 'origin_account_id', 'destination_account_id'])]
class Transaction extends Model
{
    use HasFactory;

    protected $casts = [
        'amount' => 'decimal:2',
        'reversed' => 'boolean',
        'reversed_at' => 'datetime',
    ];

    public function originAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'origin_account_id');
    }

    public function destinationAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'destination_account_id');
    }
}
