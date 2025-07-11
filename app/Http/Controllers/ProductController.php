<?php

namespace App\Http\Controllers;

use App\DataTables\ProductDataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Bank;
use App\Models\ProductCCTVSettings;
use Illuminate\Support\Facades\Storage;
use App\Models\ProductDocument;

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
        $product = Product::with(['category', 'product_cctvs', 'product_documents'])->findOrFail($id);
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
            'cctv_settings' => $product->product_cctvs->first(),
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
            'address' => 'nullable|string',
            'embed_map' => 'nullable|string',
            'cctv_username' => 'nullable|string|max:255',
            'cctv_password' => 'nullable|string|max:255',
            'cctv_cloud_serial' => 'nullable|string|max:255',
            'cctv_name' => 'nullable|string|max:255',
            'cctv_android_app' => 'nullable|string|max:255',
            'cctv_ios_app' => 'nullable|string|max:255',
            'guidance' => 'nullable|string|max:255',
            'attachment' => 'nullable|string|max:255',

            'new_document' => 'nullable|file|mimes:pdf|max:5120',
            'new_document_description' => 'nullable|string',
        ]);

        $product->update($validated);
        $product->product_cctvs()->updateOrCreate(
            ['product_id' => $product->id], // Kondisi untuk mencari record
            [ // Data untuk diupdate atau dibuat
                'cctv_username' => $validated['cctv_username'],
                'cctv_password' => $validated['cctv_password'],
                'cctv_cloud_serial' => $validated['cctv_cloud_serial'],
                'cctv_name' => $validated['cctv_name'],
                'cctv_android_app' => $validated['cctv_android_app'],
                'cctv_ios_app' => $validated['cctv_ios_app'],
                'guidance' => $validated['guidance'],
                'attachment' => $validated['attachment'],
            ]
        );

        if ($request->hasFile('new_document')) {
            $file = $request->file('new_document');
            $originalName = $file->getClientOriginalName();

            // Simpan file ke storage/app/public/product_documents
            $path = $file->store('product_documents', 'public');

            // Buat entri baru di database
            $product->documents()->create([
                'docname' => $originalName,
                'path' => $path,
                'description' => $request->input('new_document_description'),
            ]);
        }

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
    public function showCertificate($id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('products/certificate', [
            'product' => $product,
        ]);
    }
}
