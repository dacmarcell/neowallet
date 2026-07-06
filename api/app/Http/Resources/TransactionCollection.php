<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class TransactionCollection extends ResourceCollection
{
    public function toArray($request): array
    {
        return [
            'data' => $this->collection,
        ];
    }

    public function paginationInformation($_, $paginated): array
    {
        return [
            'current_page' => $paginated['current_page'],
            'last_page'    => $paginated['last_page'],
            'per_page'     => $paginated['per_page'],
            'total'        => $paginated['total'],
        ];
    }
}
