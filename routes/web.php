<?php

use App\Http\Controllers\CollectionController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\PanelController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', 'login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('collections', CollectionController::class);
    Route::get('collections/{collection}/configuration', [CollectionController::class, 'configuration'])
        ->name('collections.configuration');

    Route::put('collections/{collection}/panels/reorder', [PanelController::class, 'updateOrder'])->name('panels.update.order');
    Route::put('collections/{collection}/panels/fields/reorder', [PanelController::class, 'updateFieldOrder'])->name('panels.fields.update.order');
    Route::resource('collections.panels', PanelController::class);
    Route::put('collections/{collection}/panels/{panel}/visibility', [PanelController::class, 'updateVisibility'])->name('panels.update.visibility');

    Route::post('fields/validate', [FieldController::class, 'validateField'])->name('fields.validate');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
