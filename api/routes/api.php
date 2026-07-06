<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('auth/login', [AuthController::class, 'login']);

    // Public user registration
    Route::post('users', [UserController::class, 'store']);

    // Protected routes
    Route::middleware('auth')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);

        Route::get('users', [UserController::class, 'index']);
        Route::get('users/search', [UserController::class, 'search']);
        Route::get('users/{user}', [UserController::class, 'show']);
        Route::put('users/{user}', [UserController::class, 'update']);
        Route::patch('users/{user}', [UserController::class, 'update']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);

        // Accounts
        Route::get('accounts', [AccountController::class, 'index']);
        Route::get('accounts/{account}', [AccountController::class, 'show']);
        Route::post('accounts', [AccountController::class, 'store']);
        Route::put('accounts/{account}', [AccountController::class, 'update']);
        Route::patch('accounts/{account}', [AccountController::class, 'update']);
        Route::delete('accounts/{account}', [AccountController::class, 'destroy']);
        Route::post('accounts/deposit', [AccountController::class, 'deposit']);
        Route::post('accounts/transfer', [AccountController::class, 'transfer']);

        // Transactions
        Route::get('transactions', [TransactionController::class, 'index']);
        Route::get('transactions/{transaction}', [TransactionController::class, 'show']);
        Route::post('transactions/{transaction}/reverse', [TransactionController::class, 'reverse']);
    });
});
