<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Pagination\LengthAwarePaginator;

class TransactionService
{
    public function getAllTransactions(): LengthAwarePaginator
    {
        $accountId = auth()->user()->account->id;

        return Transaction::with(['originAccount.user', 'destinationAccount.user'])
            ->where('origin_account_id', $accountId)
            ->orWhere('destination_account_id', $accountId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);
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

    public function generateReceiveLink(array $data): array
    {
        $payload = Crypt::encryptString(json_encode(
            [
                'destination_account_id' => $data['destination_account_id'],
                'amount' => $data['amount'],
                'expires_at' => now()->addDays(7)->timestamp
            ]
        ));
        
        $frontendUrl = config('app.frontend_url');

        return [
            'link' => "{$frontendUrl}/dashboard?token={$payload}",
        ];
    }

    public function decryptToken(string $token): array
    {
        try {
            $payload = json_decode(Crypt::decryptString($token), true);
        } catch (DecryptException $e) {
            return [
                'is_link_valid' => false,
                'destination_account_username' => null,
                'amount' => null,
            ];
        }

        if (now()->timestamp > $payload['expires_at']) {
            return [
                'is_link_valid' => false,
                'destination_account_username' => null,
                'amount' => null,
            ];
        }

        $account = Account::find($payload['destination_account_id']);

        if (!$account) {
            return [
                'is_link_valid' => false,
                'destination_account_username' => null,
                'amount' => null,
            ];
        }

        return [
            'is_link_valid' => true,
            'destination_account_username' => $account->user->username,
            'amount' => $payload['amount'],
        ];
    }
}
