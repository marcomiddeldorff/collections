<?php

/*
 * @author Marco Middeldorff <nc-middelma@gmx.de>
 */

namespace App\Services;

use App\Models\Collection;
use App\Models\Panel;
use App\Repositories\PanelRepository;
use App\Shared\Notify;
use Illuminate\Support\Facades\DB;

class PanelService
{
    public function __construct(
        public PanelRepository $panelRepository,
        public FieldService $fieldService
    ) {}

    public function storePanel(Collection $collection, array $data): void
    {
        // Use transaction to prevent dead data.
        try {
            DB::transaction(function () use ($collection, $data) {
                // First, store the panel.
                $panel = $this->panelRepository->storeForCollection($collection, $data);

                // Then, store the fields for the panel.
                $this->fieldService->storeFieldsForPanel($panel, $data['fields']);
            });

            Notify::success('Das Panel wurde erfolgreich erstellt.');
        } catch (\Throwable $e) {
            logger()->error('Error storing panel: '.$e->getMessage());
            Notify::error('Beim Speichern des Panels ist ein Fehler aufgetreten. Bitte versuche es erneut.');
        }
    }

    public function updatePanel(Panel $panel, array $data): void
    {
        try {
            DB::transaction(function () use ($panel, $data) {
                $this->panelRepository->update($panel, $data);

                $this->fieldService->updateFieldsForPanel($panel, $data['fields']);
            });

            Notify::success('Das Panel wurde erfolgreich aktualisiert.');
        } catch (\Throwable $e) {
            logger()->error('Error updating panel: '.$e->getMessage());
            Notify::error('Beim Aktualisieren des Panels ist ein Fehler aufgetreten. Bitte versuche es erneut.');
        }
    }

    public function reorder(Collection $collection, array $panels): void
    {
        try {
            DB::transaction(function () use ($collection, $panels) {
                collect($panels)->each(function ($panelId, $index) use ($collection) {
                    $panel = $collection->panels()->find($panelId)->first();
                    $this->panelRepository->update($panel, ['sort' => $index]);
                });
            });
        } catch (\Throwable $e) {
            logger()->error('Error reordering panels: '.$e->getMessage());
        }
    }
}
