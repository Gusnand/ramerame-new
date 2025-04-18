<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // ENDPOINT UNTUK PRODUK *********************************************************************************

    Route::get('/products', function () {
        return Inertia::render('products/index');
    })->name('products');

    Route::get('/products/editproduct/{id}', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/update/{id}', [ProductController::class, 'update'])->name('products.update');

    // ENDPOINT UNTUK .............................................................................

    Route::get('dashboard', [ProductController::class, 'index'])->name('dashboard');
    Route::get('/products/data', [ProductController::class, 'getData'])->name('products.data');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
