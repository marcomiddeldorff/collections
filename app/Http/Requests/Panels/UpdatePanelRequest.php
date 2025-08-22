<?php

namespace App\Http\Requests\Panels;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePanelRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'fields' => ['required', 'array'],
            'fields.*.id' => ['nullable', 'exists:fields,id'],
            'fields.*.key' => ['required', 'string', 'max:255'],
            'fields.*.label' => ['required', 'string', 'max:255'],
            'fields.*.type' => ['required', 'string', 'in:text,date,datetime-local,select'],
            'fields.*.required' => ['bool'],
            'fields.*.config.options' => ['nullable', 'array'],
            'fields.*.config.options.*' => ['required', 'string', 'max:255'],
        ];
    }
}
