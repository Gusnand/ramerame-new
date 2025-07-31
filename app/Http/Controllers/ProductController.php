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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
        try {
            $product = Product::findOrFail($id);

            // Log incoming request data for debugging
            Log::debug('Product Update Request Data:', $request->all());

            // Handle date formatting
            $expiredDate = $request->input('expired_date');
            if ($expiredDate) {
                try {
                    // Convert the date to MySQL format (Y-m-d)
                    $date = new \DateTime($expiredDate);
                    $formattedDate = $date->format('Y-m-d');
                } catch (\Exception $e) {
                    Log::error('Date parsing error: ' . $e->getMessage());
                    return redirect()->back()->withErrors(['expired_date' => 'Invalid date format']);
                }
            }

            // Map the incoming field names to the expected names
            $data = [
                'product_name' => $request->input('product_name', $request->input('name')),
                'product_category_id' => $request->input('product_category_id', $request->input('category')),
                'product_slug' => $request->input('short_content'),
                'expired_date' => $formattedDate ?? null,
            ];

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|numeric',
                'expired_date' => 'required|date_format:Y-m-d,m/d/Y',
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

            // Log data before update
            Log::debug('Data to update:', $dataToUpdate);

            $product->update($dataToUpdate);

            // Only update CCTV settings if the fields are present
            if ($request->has(['cctv_username', 'cctv_password', 'cctv_cloud_serial', 'cctv_name'])) {
                $product->product_cctvs()->updateOrCreate(
                    ['product_id' => $product->id],
                    [
                        'cctv_username' => $validated['cctv_username'] ?? null,
                        'cctv_password' => $validated['cctv_password'] ?? null,
                        'cctv_cloud_serial' => $validated['cctv_cloud_serial'] ?? null,
                        'cctv_name' => $validated['cctv_name'] ?? null,
                        'cctv_android_app' => $validated['cctv_android_app'] ?? null,
                        'cctv_ios_app' => $validated['cctv_ios_app'] ?? null,
                        'guidance' => $validated['guidance'] ?? null,
                        'attachment' => $validated['attachment'] ?? null,
                    ]
                );
            }

            if ($request->hasFile('new_document')) {
                $file = $request->file('new_document');
                $originalName = $file->getClientOriginalName();

                try {
                    // Simpan file ke storage/app/public/product_documents
                    $path = $file->store('product_documents', 'public');

                    // Buat entri baru di database
                    $product->documents()->create([
                        'docname' => $originalName,
                        'path' => $path,
                        'description' => $request->input('new_document_description'),
                    ]);
                } catch (\Exception $e) {
                    Log::error('File upload error: ' . $e->getMessage());
                    return response()->json(['message' => 'Error uploading document'], 500);
                }
            }

            return redirect()->route('products')->with('success', 'Produk berhasil diperbarui.');

        } catch (\Exception $e) {
            Log::error('Product update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating product: ' . $e->getMessage()]);
        }
    }




    public function store(Request $request)
    {
        try {
            $request->validate(['image' => 'required|image|max:2048']);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $fullUrl = asset('storage/' . $path);

                return response()->json([
                    'url' => $fullUrl,
                    'success' => true
                ]);
            }

            return response()->json([
                'message' => 'Image upload failed',
                'success' => false
            ], 400);
        } catch (\Exception $e) {
            Log::error('Image upload error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Image upload failed: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    public function showCertificate($id)
    {
        try {
            $product = Product::findOrFail($id);
            return Inertia::render('products/certificate', [
                'product' => $product,
            ]);
        } catch (\Exception $e) {
            Log::error('Certificate view error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to load certificate');
        }
    }
}