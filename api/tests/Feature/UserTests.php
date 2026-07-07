<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can create user', function () {
    $response = $this->postJson('/api/v1/users', [
        'name' => 'Test User',
        'username' => 'test',
        'email' => 'test@example.com',
        'password' => 'password',
    ]);
    $response->assertStatus(201);
    $response->assertCreated()->assertJsonFragment([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
    ]);
});

test("can find user", function () {
    $user = User::factory()->create();
    $response = $this->getJson("/api/v1/users/{$user->id}");
    $response->assertOk()->assertJsonFragment([
        'id' => $user->id,
        'email' => $user->email,
    ]);
});

test("can update user", function (){
    $user = User::factory()->create();
    $response = $this->putJson("/api/v1/users/{$user->id}", [
        'name' => 'New test name',
    ]);
    $response->assertOk();

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'New test name',
    ]);
});

test("can delete user", function () {
    $user = User::factory()->create();
    $response = $this->deleteJson("/api/v1/users/{$user->id}");
    $response->assertNoContent();

    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});