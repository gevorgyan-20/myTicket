<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // orinak heto karas avelacnes
        // App\Models\Movie::class => App\Policies\MoviePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // porcnakan Gate vor heto karas ogtagorces
        Gate::define('is-admin', function ($user) {
            return $user->role === 'admin';
        });
    }
}
