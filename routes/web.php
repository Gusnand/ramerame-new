<?php

use App\Http\Controllers\API\ImageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::redirect('/', '/login', 301);

Route::get('/test-storage', function () {
    return response()->json([
        'storage_path' => storage_path('app/public'),
        'public_path' => public_path('storage'),
        'exists' => file_exists(public_path('storage')),
        'is_link' => is_link(public_path('storage')),
    ]);
});

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
    Route::get('/products/data', [ProductController::class, 'getData'])->name('products.data');
    Route::post('/products/editproduct/upload-image', [ProductController::class, 'store']);
    // Route::get('/products/certificate/{id}', [ProductController::class, 'showCertificate'])->name('products.certificate');
    Route::get('/products/sales-report/{id}', [SalesController::class, 'index'])->name('products.sales-report');

    // Route::get('/products/{id}/certificate', 'Super\CertificateController@editor')->name('certificate.editor');
    Route::get('/products/{id}/certificate', 'CertificateController@editor')->name('certificate.editor');
    Route::post('/products/certificate/save', 'CertificateController@save')->name('certificate.save');
    Route::post('/products/certificate/update', 'CertificateController@update')->name('certificate.update');

    // ENDPOINT UNTUK .............................................................................

    Route::get('dashboard', [ProductController::class, 'index'])->name('dashboard');

});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
