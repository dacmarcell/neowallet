<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Pagination\LengthAwarePaginator;

class TransactionService
{
    public function getAllTransactions(int $page = 1): LengthAwarePaginator
    {
        $accountId = auth()->user()->account->id;

        return Transaction::with(['originAccount.user', 'destinationAccount.user'])
            ->where('origin_account_id', $accountId)
            ->orWhere('destination_account_id', $accountId)
            ->orderBy('created_at', 'desc')
            ->paginate(20, ['*'], 'page', $page);
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
