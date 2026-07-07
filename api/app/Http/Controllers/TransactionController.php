<?php

namespace App\Http\Controllers;

use App\Http\Requests\DecryptTokenRequest;
use App\Http\Requests\ReceiveRequest;
use App\Http\Resources\DecryptTokenResource;
use App\Http\Resources\ReceiveTransactionResource;
use App\Http\Resources\TransactionCollection;
use App\Http\Resources\TransactionResource;
use App\Services\TransactionService;

class TransactionController extends Controller
{
    public function __construct(
        private TransactionService $transactionService
    ) {}

    public function index(): TransactionCollection
    {
        $transactions = $this->transactionService->getAllTransactions();
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

    public function receiveLink(ReceiveRequest $request): ReceiveTransactionResource
    {
        $payload = $this->transactionService->generateReceiveLink($request->validated());
        return new ReceiveTransactionResource($payload);
    }

    public function decryptToken(DecryptTokenRequest $request): DecryptTokenResource
    {
        $payload = $this->transactionService->decryptToken($request->validated()['token']);
        return new DecryptTokenResource($payload);
    }
}
