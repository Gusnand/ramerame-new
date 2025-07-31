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

    public function getData(Request $request)
    {
        $products = Product::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('product_name', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc')
            ->paginate(10);

        return response()->json($products);
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

        $insurances = \App\Models\Insurance::all()
            ->map(function ($insurance) {
                return [
                    'value' => $insurance->id,
                    'label' => $insurance->name,
                ];
            })->toArray();

        return Inertia::render('products/editproduct', [
            'product' => $product,
            'categories' => $categories,
            'banks' => $banks,
            'insurances' => $insurances,
            'cctv_settings' => $product->product_cctvs->first(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        // Map the incoming field names to the expected names
        $data = [
            'product_name' => $request->input('name'),
            'product_category_id' => $request->input('category'),
            'product_slug' => \Illuminate\Support\Str::slug($request->input('name')), // Generate slug from name
            'expired_date' => date('m/d/Y', strtotime($request->input('expired_date'))),
        ];

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|numeric',
            'expired_date' => 'required|date',
            'content' => 'required|string',
            'term' => 'required|string',
            'status' => 'required|string',
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
            'insurance_id' => 'nullable|exists:insurances,id',
            'has_payroll_loan' => 'boolean',

            'new_document' => 'nullable|file|mimes:pdf|max:5120',
            'new_document_description' => 'nullable|string',
        ]);

        // Merge the mapped data with other validated fields
        $dataToUpdate = array_merge($data, [
            'content' => $validated['content'],
            'term' => $validated['term'],
            'status' => $validated['status'],
            'invest_month' => $validated['invest_month'],
            'account_no' => $validated['account_no'],
            'on_behalf_of' => $validated['on_behalf_of'],
            'bank_id' => $validated['bank_id'],
        ]);

        $product->update($dataToUpdate);
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
