<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
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
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        \Illuminate\Database\Eloquent\Relations\Relation::morphMap([
            'movie'   => \App\Models\Movie::class,
            'concert' => \App\Models\Concert::class,
            'standup' => \App\Models\Standup::class,
        ]);
    }
}
