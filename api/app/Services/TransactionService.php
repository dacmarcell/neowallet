<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection;

class TransactionService
{
    public function getAllTransactions(): Collection
    {
        return Transaction::with(['originAccount.user', 'destinationAccount.user'])->get();
    }

    public function getTransactionById(int $id): Transaction
    {
        return Transaction::with(['originAccount.user', 'destinationAccount.user'])->findOrFail($id);
    }

    public function reverseTransaction(Transaction $transaction): Transaction
    {
        $accountService = app(AccountService::class);
        return $accountService->reverseTransaction($transaction);
    }
}
