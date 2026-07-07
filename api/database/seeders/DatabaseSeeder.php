<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user1 = User::create([
            'name' => 'Maria Silva',
            'username' => 'maria',
            'email' => 'maria@email.com',
            'password' => 'password',
        ]);

        $user2 = User::create([
            'name' => 'João Santos',
            'username' => 'joao',
            'email' => 'joao@email.com',
            'password' => 'password',
        ]);

        $account1 = Account::create([
            'user_id' => $user1->id,
            'balance' => 5000.00,
        ]);

        $account2 = Account::create([
            'user_id' => $user2->id,
            'balance' => 3000.00,
        ]);

        for ($i = 1; $i <= 20; $i++) {
            $origin = $i % 2 === 0 ? $account1 : $account2;
            $destination = $i % 2 === 0 ? $account2 : $account1;

            Transaction::create([
                'type' => 'transfer',
                'amount' => random_int(10, 500),
                'origin_account_id' => $origin->id,
                'destination_account_id' => $destination->id,
                'reversed' => false,
                'reversed_at' => null,
            ]);
        }
    }
}
