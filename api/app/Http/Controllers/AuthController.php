<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\AuthResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function login(LoginRequest $request): AuthResource
    {
        $user = $this->authService->login($request->validated());

        return new AuthResource($user);
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function me(): AuthResource
    {
        $user = $this->authService->getCurrentUser();

        return new AuthResource($user);
    }
}
