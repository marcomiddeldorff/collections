<?php

/*
 * @author Marco Middeldorff <nc-middelma@gmx.de>
 */

namespace App\Services;

use App\Models\Panel;
use App\Repositories\FieldRepository;

class FieldService
{
    public function __construct(
        public FieldRepository $fieldRepository
    ) {}

    public function storeFieldsForPanel(Panel $panel, array $fields): void
    {
        collect($fields)->each(function ($fieldData, $key) use ($panel) {
            // Sort the options by their index key only if the sort key is not set.
            if (! isset($fieldData['sort'])) {
                $fieldData['sort'] = $key;
            }

            if ($fieldData['type'] === 'select') {
                $fieldData['config']['options'] = collect($fieldData['options'])->map(function ($option) {
                    return $option['value'];
                })->toArray();
            }

            $this->fieldRepository->storeForPanel($panel, $fieldData);
        });
    }

    public function updateFieldsForPanel(Panel $panel, array $fields): void
    {
        collect($fields)->each(function ($fieldData, $key) use ($panel) {
            if (isset($fieldData['id'])) {
                $field = $this->fieldRepository->findById((int) $fieldData['id']);

                if ($field) {
                    $this->fieldRepository->update($field, $fieldData);
                    return;
                }
            }

            $this->fieldRepository->storeForPanel($panel, $fieldData);
        });
    }
}
