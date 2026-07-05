<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Log;

class AccountService
{
    public function getAllAccounts(): Collection
    {
        return Account::with('user')->get();
    }

    public function getAccountById(int $id): Account
    {
        return Account::with('user')->findOrFail($id);
    }

    public function createAccount(array $data): Account
    {
        return Account::create($data);
    }

    public function updateAccount(Account $account, array $data): Account
    {
        $account->update($data);
        return $account->fresh();
    }

    public function deleteAccount(Account $account): void
    {
        $account->delete();
    }

    public function deposit(Account $account, float $amount): Transaction
    {
        return DB::transaction(function () use ($account, $amount) {
            $account = Account::lockForUpdate()->find($account->id);
            
            $account->balance += $amount;
            $account->save();

            $transaction = Transaction::create([
                'type' => 'deposit',
                'amount' => $amount,
                'destination_account_id' => $account->id,
            ]);

            return $transaction;
        });
    }

    public function transfer(Account $origin, Account $destination, float $amount): Transaction
    {
        return DB::transaction(function () use ($origin, $destination, $amount) {
            $origin = Account::lockForUpdate()->find($origin->id);
            $destination = Account::lockForUpdate()->find($destination->id);

            if ($origin->balance < $amount) {
                throw new \Exception('Insufficient balance');
            }

            $origin->balance -= $amount;
            $destination->balance += $amount;

            $origin->save();
            $destination->save();

            $transaction = Transaction::create([
                'type' => 'transfer',
                'amount' => $amount,
                'origin_account_id' => $origin->id,
                'destination_account_id' => $destination->id,
            ]);

            return $transaction;
        });
    }

    public function reverseTransaction(Transaction $transaction): Transaction
    {
        return DB::transaction(function () use ($transaction) {
            if ($transaction->reversed) {
                throw new \Exception('Transaction already reversed');
            }

            if ($transaction->type === 'deposit') {
                $account = Account::lockForUpdate()->find($transaction->destination_account_id);
                $account->balance -= $transaction->amount;
                $account->save();
            } elseif ($transaction->type === 'transfer') {
                $origin = Account::lockForUpdate()->find($transaction->origin_account_id);
                $destination = Account::lockForUpdate()->find($transaction->destination_account_id);

                $origin->balance += $transaction->amount;
                $destination->balance -= $transaction->amount;

                $origin->save();
                $destination->save();
            }

            $transaction->reversed = true;
            $transaction->reversed_at = \Illuminate\Support\Carbon::now();
            $transaction->save();

            return $transaction->fresh();
        });
    }
}
