<?php

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/** @var User $this->user */
/** @var Account $this->origin */
/** @var Account $this->destination */

beforeEach(function () {
    $user = User::factory()->create();
    $user2 = User::factory()->create();

    $this->actingAs($user);

    $this->origin = Account::factory()->create([
        'user_id' => $user->id,
        'balance' => 1000,
    ]);

    $this->destination = Account::factory()->create([
        'user_id' => $user2->id,
        'balance' => 500,
    ]);
});

test('can transfer between accounts', function () {
    $response = $this->postJson('/api/v1/accounts/transfer', [
        'origin_account_id' => $this->origin->id,
        'destination_username' => $this->destination->user->username,
        'amount' => 100,
    ]);

    $response->assertStatus(201);

    $this->assertDatabaseHas('transactions', [
        'origin_account_id' => $this->origin->id,
        'destination_account_id' => $this->destination->id,
        'amount' => 100,
    ]);
});

test('decreases origin account balance', function () {
    $this->postJson('/api/v1/accounts/transfer', [
        'origin_account_id' => $this->origin->id,
        'destination_username' => $this->destination->user->username,
        'amount' => 100,
    ])->assertStatus(201);

    expect((float) $this->origin->fresh()->balance)
        ->toBe(900.00);
});

test('increases destination account balance', function () {
    $this->postJson('/api/v1/accounts/transfer', [
        'origin_account_id' => $this->origin->id,
        'destination_username' => $this->destination->user->username,
        'amount' => 100,
    ])->assertStatus(201);

    expect((float) $this->destination->fresh()->balance)
        ->toBe(600.00);
});

test('transaction appears in account history', function () {
    $this->postJson('/api/v1/accounts/transfer', [
        'origin_account_id' => $this->origin->id,
        'destination_username' => $this->destination->user->username,
        'amount' => 100,
    ]); 

    $response = $this->getJson('/api/v1/transactions');

    $response
        ->assertOk()
        ->assertJsonFragment([
            'origin_account_id' => $this->origin->id,
            'destination_account_id' => $this->destination->id,
        ]);
});

test('cannot transfer with insufficient balance', function () {
    $this->origin->update([
        'balance' => 50,
    ]);

    $response = $this->postJson('/api/v1/accounts/transfer', [
        'origin_account_id' => $this->origin->id,
        'destination_username' => $this->destination->user->username,
        'amount' => 100,
    ]);

    $response->assertStatus(500);

    $this->assertDatabaseMissing('transactions', [
        'origin_account_id' => $this->origin->id,
        'destination_account_id' => $this->destination->id,
        'amount' => 100,
    ]);
});

test('cannot transfer to the same account', function () {
    $response = $this->postJson('/api/v1/accounts/transfer', [
        'origin_account_id' => $this->origin->id,
        'destination_username' => $this->origin->user->username,
        'amount' => 100,
    ]);

    $response->assertStatus(500);
});

test('returns unprocessable entity when account does not exist', function () {
    $response = $this->postJson('/api/v1/accounts/transfer', [
        'origin_account_id' => 999999,
        'destination_username' => 'non_existent_user',
        'amount' => 100,
    ]);

    $response->assertStatus(422);
});