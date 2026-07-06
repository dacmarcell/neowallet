<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionCollection;
use App\Http\Resources\TransactionResource;
use App\Services\TransactionService;

class TransactionController extends Controller
{
    public function __construct(
        private TransactionService $transactionService
    ) {}

    public function index(int $page = 1): TransactionCollection
    {
        $transactions = $this->transactionService->getAllTransactions($page);
        return new TransactionCollection($transactions);
    }

    public function show(int $id): TransactionResource
    {
        $transaction = $this->transactionService->getTransactionById($id);
        return new TransactionResource($transaction);
    }

    public function reverse(int $id): TransactionResource
    {
        $transaction = $this->transactionService->getTransactionById($id);
        $transaction = $this->transactionService->reverseTransaction($transaction);
        return new TransactionResource($transaction);
    }
}
