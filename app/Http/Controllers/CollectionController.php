<?php

namespace App\Http\Controllers;

use App\Http\Requests\Collections\StoreCollectionRequest;
use App\Http\Requests\UpdateCollectionRequest;
use App\Models\Collection;
use App\Services\CollectionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('collections/index', [
            'collections' => Collection::owner()->latest()->get(),
        ]);
    }

    /**
     * Configuration the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('collections/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCollectionRequest $request, CollectionService $collectionService): RedirectResponse
    {
        $collectionService->storeCollection($request->validated(), $request->file('thumbnail'));

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Collection $collection)
    {
        Gate::authorize('view', $collection);

        return Inertia::render('collections/configuration', [
            'collection' => $collection->loadMissing('panels.fields'),
        ]);
    }

    public function configuration(Collection $collection)
    {
        Gate::authorize('view', $collection);

        return Inertia::render('collections/configuration', [
            'collection' => $collection->loadMissing('panels.fields'),
        ]);
    }

    /**
     * Configuration the form for editing the specified resource.
     */
    public function edit(Collection $collection): Response
    {
        Gate::authorize('update', $collection);

        return Inertia::render('collections/edit', [
            'collection' => $collection,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCollectionRequest $request, Collection $collection, CollectionService $collectionService)
    {
        $collectionService->updateCollection($collection, $request->validated(), $request->file('thumbnail'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collection $collection, CollectionService $collectionService)
    {
        Gate::authorize('delete', $collection);

        $collectionService->deleteCollection($collection);
    }
}
