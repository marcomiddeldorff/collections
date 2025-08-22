<?php

namespace App\Http\Requests\Panels;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVisibilityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'logic' => ['in:ALL,ANY'],
            'conditions' => ['required', 'array'],
            'conditions.*.field' => ['required', 'exists:fields,key'],
            'conditions.*.operator' => ['required', 'in:equals,not_equals,in,not_in,gt,gte,lt,lte,is_true,is_false,is_empty,is_not_empty'],
            'conditions.*.value' => ['required', function ($attribute, $value, $fail) {
                if (gettype($value) === 'string') {
                    return 'string';
                } else {
                    return 'array';
                }
            }],
        ];
    }
}
