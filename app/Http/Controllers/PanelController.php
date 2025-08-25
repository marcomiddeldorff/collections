<?php

namespace App\Http\Controllers;

use App\Http\Requests\Panels\StorePanelRequest;
use App\Http\Requests\Panels\UpdatePanelRequest;
use App\Http\Requests\Panels\UpdateVisibilityRequest;
use App\Models\Collection;
use App\Models\Panel;
use App\Repositories\PanelRepository;
use App\Services\FieldService;
use App\Services\PanelService;
use App\Shared\Notify;
use Illuminate\Http\Request;

class PanelController extends Controller
{

    public function store(StorePanelRequest $request, Collection $collection, PanelService $panelService)
    {
        $panelService->storePanel($collection, $request->validated());
    }

    public function update(UpdatePanelRequest $request, Collection $collection, Panel $panel, PanelService $panelService)
    {
        $panelService->updatePanel($panel, $request->validated());
    }

    public function updateVisibility(UpdateVisibilityRequest $request, Collection $collection, Panel $panel, PanelRepository $panelRepository)
    {
        try {
            $panelRepository->update($panel, [
                'visibility' => $request->validated(),
            ]);

            Notify::success('Die Sichtbarkeits-Regeln wurden erfolgreich aktualisiert.');
        } catch (\Throwable $e) {
            logger()->error('Error updating panel visibility: '.$e->getMessage());
            Notify::error('Beim Aktualisieren der Sichtbarkeits-Regeln ist ein Fehler aufgetreten.');
        }
    }

    public function updateOrder(Request $request, Collection $collection, PanelService $panelService)
    {
        $panelService->reorder($collection, $request->input('panels'));
    }

    public function updateFieldOrder(Request $request, Collection $collection, Panel $panel, FieldService $fieldService)
    {
        $fieldService->reorderFieldsForPanel($panel, $request->get('fields', []));
    }

    public function destroy(Collection $collection, Panel $panel, PanelRepository $panelRepository)
    {
        $panelRepository->delete($panel);
    }
}
