<?php

namespace App\Http\Controllers;

use App\DataTables\ProductDataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Bank;
use Illuminate\Support\Facades\Storage;

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
        $banks = Bank::where('is_deleted', false)
            ->orderBy('bank_name')
            ->get()
            ->map(function ($bank) {
                return [
                    'value' => $bank->id,
                    'label' => $bank->bank_name,
                ];
            })->toArray();

        return Inertia::render('products/editproduct', [
            'product' => $product,
            'categories' => $categories,
            'banks' => $banks,
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'product_category_id' => 'required|numeric',
            'product_slug' => 'required|string|max:255',
            'content' => 'required|string|max:255',
            'term' => 'required|string',
            'status' => 'required|string',
            'expired_date' => 'required|date_format:m/d/Y',
            'invest_month' => 'required|numeric',
            'account_no' => 'required|string',
            'on_behalf_of' => 'required|string',
            'bank_id' => 'required|numeric',
        ]);

        $product->update($validated);

        return redirect()->route('products/index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function store(Request $request)
    {
        $request->validate(['image' => 'required|image|max:2048']);
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $url = Storage::disk('public')->url($path);

            return response()->json([
                'url' => $url,
                'success' => true
            ]);
        }

        return response()->json([
            'message' => 'Image upload failed',
            'success' => false
        ], 400);
    }
}
