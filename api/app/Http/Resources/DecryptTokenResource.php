<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DecryptTokenResource extends JsonResource 
{
    public function toArray(Request $request): array
    {
        return [
            "destination_account_username" => $this->resource['destination_account_username'],
            "amount" => $this->resource['amount'],
            "is_link_valid" => $this->resource['is_link_valid']
        ];
    }
}