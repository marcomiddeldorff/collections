<?php
/*
 * @author Marco Middeldorff <nc-middelma@gmx.de>
 */

namespace App\Repositories;

use App\Models\Field;
use App\Models\Panel;

class FieldRepository
{
    public function findById(int $id): ?Field
    {
        return Field::find($id);
    }

    public function storeForPanel(Panel $panel, array $data): Field
    {
        return $panel->fields()->create($data);
    }

    public function update(Field $field, array $data): Field
    {
        $field->update($data);
        $field->fresh();
        return $field;
    }
}
