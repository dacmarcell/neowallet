<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountRequest;
use App\Http\Requests\DepositRequest;
use App\Http\Requests\TransferRequest;
use App\Http\Resources\AccountCollection;
use App\Http\Resources\AccountResource;
use App\Http\Resources\TransactionResource;
use App\Models\Account;
use App\Services\AccountService;
use Illuminate\Http\JsonResponse;
use Log;

class AccountController extends Controller
{
    public function __construct(
        private AccountService $accountService
    ) {}

    public function index(): AccountCollection
    {
        $accounts = $this->accountService->getAllAccounts();
        return new AccountCollection($accounts);
    }

    public function show(int $id): AccountResource
    {
        $account = $this->accountService->getAccountById($id);
        return new AccountResource($account);
    }

    public function store(AccountRequest $request): AccountResource
    {
        $account = $this->accountService->createAccount($request->validated());
        return new AccountResource($account);
    }

    public function update(AccountRequest $request, int $id): AccountResource
    {
        $account = $this->accountService->getAccountById($id);
        $account = $this->accountService->updateAccount($account, $request->validated());
        return new AccountResource($account);
    }

    public function destroy(int $id): JsonResponse
    {
        $account = $this->accountService->getAccountById($id);
        $this->accountService->deleteAccount($account);
        return response()->json(null, 204);
    }

    public function deposit(DepositRequest $request): TransactionResource
    {
        $account = Account::findOrFail($request->account_id);
        $transaction = $this->accountService->deposit($account, $request->amount);
        return new TransactionResource($transaction);
    }

    public function transfer(TransferRequest $request): TransactionResource
    {
        $origin = Account::findOrFail($request->origin_account_id);
        $destination = Account::findOrFail($request->destination_account_id);
        $transaction = $this->accountService->transfer($origin, $destination, $request->amount);
        return new TransactionResource($transaction);
    }
}
