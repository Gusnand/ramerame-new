<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DailySalesReport;
use App\Models\Product;
use App\Models\ProductOmzet;
use App\Models\TrxEom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class SalesController extends Controller
{
    public function index($id, Request $request)
    {
        $user = Auth::user();

        // CONTROLLER UNTUK MENGAMBIL DATA SALES REPORT PERHARI
        $month = $request->input('month', Carbon::now()->format('m'));
        $year = $request->input('year', Carbon::now()->year);

        $product = Product::findOrFail($id);
        $productOmzets = ProductOmzet::where('product_id', $id)->get();

        $date = Carbon::createFromDate($year, $month, 1)->format('Y-m-d');

        // CONTROLLER UNTUK MENGAMBIL DATA SALES REPORT PERBULAN

        $productId = $request->query('id');

        // Query untuk mengambil data EOM berdasarkan product_id
        $eom = null;
        if ($productId) {
            $eom = TrxEom::where('product_id', $productId)
                ->orderBy('created_at', 'DESC')
                ->paginate(10)
                ->withQueryString(); // Memastikan query string dipertahankan di paginasi
        }

        return Inertia::render('products/sales-report', [
            'username' => $user->name,
            'omzets' => $productOmzets,
            'date' => $date,
            'month' => $month,
            'year' => $year,
            'productId' => $id,
            'product' => $product,
            'eom' => $eom ? $eom->items() : [],
        ]);
    }
}