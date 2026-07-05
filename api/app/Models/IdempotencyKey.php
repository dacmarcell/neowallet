<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'route', 'request_parameters', 'response', 'status_code'])]
class IdempotencyKey extends Model
{
    use HasFactory;

    protected $casts = [
        'request_parameters' => 'array',
        'response' => 'array',
    ];
}
