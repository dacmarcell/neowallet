<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(): UserCollection
    {
        $users = $this->userService->getAllUsers();

        return new UserCollection($users);
    }

    public function store(UserRequest $request): UserResource
    {
        $user = $this->userService->createUser($request->validated());

        return new UserResource($user);
    }

    public function show(int $id): UserResource
    {
        $user = $this->userService->getUserById($id);

        return new UserResource($user);
    }

    public function update(UserRequest $request, int $id): UserResource
    {
        $user = $this->userService->getUserById($id);
        $user = $this->userService->updateUser($user, $request->validated());

        return new UserResource($user);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);
        $this->userService->deleteUser($user);

        return response()->json(null, 204);
    }

    public function transferSearch(): UserCollection
    {
        $query = request()->query('q');
        $users = $this->userService->searchUsersForTransfer($query);

        return new UserCollection($users);
    }
}
