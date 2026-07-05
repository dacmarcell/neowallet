<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'amount' => (string) $this->amount,
            'origin_account_id' => $this->origin_account_id,
            'destination_account_id' => $this->destination_account_id,
            'reversed' => $this->reversed,
            'reversed_at' => $this->reversed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'origin_account' => $this->when($this->origin_account_id, function () {
                return [
                    'id' => $this->originAccount->id,
                    'user_id' => $this->originAccount->user_id,
                    'balance' => (string) $this->originAccount->balance,
                ];
            }),
            'destination_account' => $this->when($this->destination_account_id, function () {
                return [
                    'id' => $this->destinationAccount->id,
                    'user_id' => $this->destinationAccount->user_id,
                    'balance' => (string) $this->destinationAccount->balance,
                ];
            }),
        ];
    }
}
