<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            "name" => ["required", "string", "max:255"],
            "username" => ["required", "string", "max:100"],
            "email" => ["required", "string", "email", "max:255", Rule::unique("users", "email")],
            "password" => ["required", "string", Password::defaults()],
        ];

        if($this->isMethod("PUT") || $this->isMethod("PATCH")){
            $rules["name"] = ["sometimes", "string", "max:255"];
            $rules["username"] = ["sometimes", "string", "max:100"];
            $rules["email"] = ["sometimes", "string", "email", "max:255", Rule::unique("users", "email")->ignore($this->route("id"))];
            $rules["password"] = ["sometimes", "string", Password::defaults()];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a string.',
            'name.max' => 'The name may not be greater than 255 characters.',
            'username.required' => 'The username field is required.',
            'username.string' => 'The username must be a string.',
            'username.max' => 'The username may not be greater than 100 characters.',
            'email.required' => 'The email field is required.',
            'email.string' => 'The email must be a string.',
            'email.email' => 'The email must be a valid email address.',
            'email.max' => 'The email may not be greater than 255 characters.',
            'email.unique' => 'The email has already been taken.',
            'password.required' => 'The password field is required.',
            'password.string' => 'The password must be a string.',
        ];
    }
}
