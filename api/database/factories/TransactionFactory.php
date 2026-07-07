<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'type' => 'transfer',
            'amount' => fake()->randomFloat(2, 1, 1000),
            'origin_account_id' => Account::factory(),
            'destination_account_id' => Account::factory(),
            'reversed' => false,
            'reversed_at' => null,
        ];
    }

    public function reversed(): static
    {
        return $this->state(fn () => [
            'reversed' => true,
            'reversed_at' => now(),
        ]);
    }

    public function amount(float $amount): static
    {
        return $this->state(fn () => [
            'amount' => $amount,
        ]);
    }

    public function between(Account $origin, Account $destination): static
    {
        return $this->state(fn () => [
            'origin_account_id' => $origin->id,
            'destination_account_id' => $destination->id,
        ]);
    }
}