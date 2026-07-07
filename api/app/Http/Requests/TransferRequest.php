<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'origin_account_id' => ['required', 'exists:accounts,id'],
            'destination_username' => ['required', 'exists:users,username'],
            'amount' => ['required', 'numeric', 'gt:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'origin_account_id.required' => 'The origin account ID field is required.',
            'origin_account_id.exists' => 'The origin account does not exist.',
            'destination_username.required' => 'The destination username field is required.',
            'destination_username.exists' => 'The destination user does not exist.',
            'amount.required' => 'The amount field is required.',
            'amount.numeric' => 'The amount must be a number.',
            'amount.gt' => 'The amount must be greater than 0.',
        ];
    }
}
