<?php

/*
 * @author Marco Middeldorff <nc-middelma@gmx.de>
 */

namespace App\Repositories;

use App\Models\Collection;
use App\Models\Panel;

class PanelRepository
{
    /**
     * Store a new panel for a collection.
     */
    public function storeForCollection(Collection $collection, array $data): Panel
    {
        return $collection->panels()->create($data);
    }

    /**
     * Update a panel.
     * @param Panel $panel
     * @param array $data
     * @return Panel
     */
    public function update(Panel $panel, array $data): Panel
    {
        // Update the panel.
        $panel->update($data);
        // Reload the panel to get the updated fields.
        $panel->fresh();

        return $panel;
    }
}
