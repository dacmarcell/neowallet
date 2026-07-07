<?php

namespace App\Services;

use App\Models\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UserService
{
    public function getAllUsers(): Collection
    {
        return User::all();
    }

    public function getUserById(int $id): User
    {
        return User::findOrFail($id);
    }

    public function createUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create($data);
            Account::create([
                'user_id' => $user->id,
                'balance' => 0.00,
            ]);
            return $user;
        });
    }

    public function updateUser(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh();
    }

    public function deleteUser(User $user): void
    {
        $user->delete();
    }

    public function searchUsersForTransfer(?string $query): Collection
    {
        if (!$query) {
            return collect();
        }

        $loggedUserId = auth()->id();

        $results = User::where('id', '!=', $loggedUserId)
            ->where(function ($q) use ($query) {
                $q->where('username', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get();

        if ($results->isEmpty() && User::where('id', $loggedUserId)
            ->where(function ($q) use ($query) {
                $q->where('username', 'like', "%{$query}%");
            })->exists()
        ) {
            throw new BadRequestHttpException('Você não pode transferir para si mesmo.');
        }

        return $results;
    }
}
