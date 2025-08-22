<?php

namespace App\Providers;

use App\Repositories\CollectionRepository;
use App\Repositories\FieldRepository;
use App\Repositories\PanelRepository;
use App\Services\CollectionService;
use App\Services\FieldService;
use App\Services\PanelService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerServices();
        $this->registerRepositories();
    }

    protected function registerServices(): void
    {
        $this->app->singleton(CollectionService::class);
        $this->app->singleton(PanelService::class);
        $this->app->singleton(FieldService::class);
    }

    protected function registerRepositories(): void
    {
        $this->app->singleton(CollectionRepository::class);
        $this->app->singleton(PanelRepository::class);
        $this->app->singleton(FieldRepository::class);
    }
}
