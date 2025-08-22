<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ValidateFieldRequest extends FormRequest
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
        $baseValidationRules = [
            'label' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:text,date,datetime-local,select'],
            'required' => ['bool'],
            'options' => ['nullable', 'required_if:type,select', 'array'],
        ];

        if ($this->get('id')) {
            $baseValidationRules['key'] = ['required', 'string', 'max:255', 'unique:fields,key,'.$this->get('id')];
        } else {
            $baseValidationRules['key'] = ['required', 'string', 'max:255', 'unique:fields,key'];
        }

        // Only validate options if the field type is select.
        if ($this->get('type') === 'select') {
            $baseValidationRules['options.*.value'] = ['required', 'string'];
        }

        return $baseValidationRules;
    }
}
