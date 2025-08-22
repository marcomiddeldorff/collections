<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateCollectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::check('update', $this->route('collection'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:collections,slug,'.$this->route('collection')->id,
            'description' => 'nullable|string|max:5000',
            'thumbnail' => function ($attribute, $value, $fail) {
                if ($value instanceof \Illuminate\Http\UploadedFile) {
                    return 'nullable|image|mimes:jpeg,png,jpg,webp|max:5096';
                }
                return 'nullable|string';
            },
        ];
    }
}
