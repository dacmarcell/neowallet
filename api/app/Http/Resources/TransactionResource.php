<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Log;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $originAccount = $this->originAccount?->user;
        $destinationAccount = $this->destinationAccount?->user;

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
            'destination_account' => $destinationAccount ? [
                "user_id" => $destinationAccount->id,
                "username" => $destinationAccount->username
            ] : null,
            'origin_account' => $originAccount ? [
                "user_id" => $originAccount->id,
                "username" => $originAccount->username
            ] : null
        ];
    }
}
