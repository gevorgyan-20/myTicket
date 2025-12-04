<?php

// routes/web.php (Ուղղված կոդ)

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api\/).*$');