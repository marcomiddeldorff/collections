<?php
/*
 * @author Marco Middeldorff <nc-middelma@gmx.de>
 */

namespace App\Repositories;

use App\Models\Collection;

class CollectionRepository
{
    /**
     * Store a new collection.
     * @param array $data
     * @return void
     */
    public function store(array $data): void
    {
        Collection::create($data);
    }

    public function update(Collection $collection, array $data): void
    {
        $collection->update($data);
    }

    public function delete(Collection $collection): void
    {
        $collection->delete();
    }
}
