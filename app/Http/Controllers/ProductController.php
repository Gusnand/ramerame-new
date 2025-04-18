<?php

namespace App\Http\Controllers;

use App\DataTables\ProductDataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\ProductCategory;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard');
    }

    public function getData(ProductDataTable $dataTable)
    {
        return $dataTable->ajax();
    }
    public function edit($id)
    {
        $product = Product::with('category')->findOrFail($id);
        $categories = ProductCategory::all();

        return Inertia::render('products/editproduct', [
            'product' => $product,
            'categories' => $categories
        ]);
        // $product = Product::findOrFail($id);
        // return Inertia::render('products/editproduct', ['product' => $product]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'product_category_id' => 'required|numeric',
            'product_slug' => 'required|string|max:255',
            'content' => 'required|string|max:255',
            // 'term' => 'required|string|max:255',
            // 'termfile' => 'required|string|max:255',
            // 'status' => 'required|string|max:255',
            // 'expired_date' => 'required|string|max:255',
            // 'max_slot' => 'required|string|max:255',
            // 'invest_amount' => 'required|string|max:255',
            // 'invest_month' => 'required|string|max:255',
            // 'platform_fee' => 'required|string|max:255',
            // 'bank_id' => 'required|string|max:255',
        ]);

        $product->update($validated);

        return redirect()->route('products/index')->with('success', 'Produk berhasil diperbarui.');
    }
}
