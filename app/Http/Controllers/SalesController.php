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
use Illuminate\Support\Facades\Log;

class SalesController extends Controller
{
    public function index($id, Request $request)
    {
        // Ambil user yang sedang login
        $user = Auth::user();

        // Ambil bulan dan tahun dari query string (default ke bulan dan tahun saat ini)
        $month = $request->input('month', Carbon::now()->format('m'));
        $year = $request->input('year', Carbon::now()->year);

        // Ambil data produk berdasarkan ID
        $product = Product::findOrFail($id);

        // Data untuk SALES REPORT PERHARI
        $date = Carbon::createFromDate($year, $month, 1)->format('Y-m-d');
        $productOmzets = ProductOmzet::where('product_id', $id)->get();



        // $productId = intval($request->input('product_id'));

        // $datePeriodStart = Carbon::createFromDate($periodYear, $periodMonth, 1, 'UTC');
        // $datePeriodEnd = Carbon::createFromDate($periodYear, $periodMonth, 1, 'UTC');

        // $firstDatePeriod = $datePeriodStart->startOfMonth();
        // $lastDatePeriod = $datePeriodEnd->endOfMonth();

        // ==============================

        // $periodMonth = intval($request->input('month'));
        // $periodYear = intval($request->input('year'));

        // $firstDatePeriod = Carbon::createFromDate($periodYear, $periodMonth, 1)->startOfMonth()->format('Y-m-d');
        // $lastDatePeriod = Carbon::createFromDate($periodYear, $periodMonth, 1)->endOfMonth()->format('Y-m-d');

        // $dailys = DailySalesReport::where('product_id', $id)
        //     ->where('sales_date', '>=', $firstDatePeriod)
        //     ->where('sales_date', '<=', $lastDatePeriod)
        //     ->get();

        // $firstDatePeriod = Carbon::createFromDate($periodYear, $periodMonth, 1, 'UTC')->startOfMonth();
        // $lastDatePeriod = Carbon::createFromDate($periodYear, $periodMonth, 1, 'UTC')->endOfMonth();

        // $dailys = $product->daily_sales_reports()
        //     ->where('sales_date', '>=', $firstDatePeriod->toDateString())
        //     ->where('sales_date', '<=', $lastDatePeriod->toDateString())->get();

        // $dailys = DailySalesReport::with(['product'])->where('product_id', $productId)

        //     ->where('sales_date', '>=', $firstDatePeriod->toDateString())
        //     ->where('sales_date', '<=', $lastDatePeriod->toDateString())->get();

        // Log::info("Daily Sales Query: " . $dailys->toSql());
        // Log::info("Daily Sales Bindings: " . json_encode($dailys->getBindings()));
        // Log::info("Daily Sales Data: " . json_encode($dailys));

        // Data untuk SALES REPORT PERBULAN

        $eom = $product->trxEoms()
            ->orderBy('period_year', 'ASC')
            ->orderBy('period_month', 'ASC')
            ->paginate(12)
            ->withQueryString();

        $dailys = $product->daily_sales_reports()
            ->orderBy('sales_date', 'DESC')  // Most recent first
            ->paginate(12)  // You can adjust the pagination count as needed
            ->withQueryString();

        // $productId = $request->query('id'); // Ambil product_id dari query string
        // $eom = null;

        // if ($productId) {
        //     $eom = TrxEom::where('product_id', $productId) // Gunakan $productId, bukan $product
        //         ->orderBy('created_at', 'DESC')
        //         ->paginate(10)
        //         ->withQueryString(); // Memastikan query string dipertahankan di paginasi
        // }


        // Log::info('First date: ' . $firstDatePeriod->toDateString());
        // Log::info('Last date: ' . $lastDatePeriod->toDateString());
        // Log::info('Daily records count: ' . $dailys->count());
        // Log::info('Daily records data: ', $dailys->toArray());

        // Kirim data ke komponen React menggunakan Inertia
        return Inertia::render('products/sales-report', [
            'username' => $user->name,
            'omzets' => $productOmzets, // Data untuk sales report harian
            'date' => $date, // Tanggal default
            'month' => $month, // Bulan filter
            'year' => $year, // Tahun filter
            'productId' => $id, // ID produk dari URL
            'product' => $product, // Data produk
            'eom' => $eom ? $eom->items() : [], // Data untuk sales report bulanan
            'pagination' => $eom ? $eom->toArray()['links'] : [], // Pagination links
            'dailys' => $dailys ? $dailys->items() : [],  // Get items from pagination
            'dailysPagination' => $dailys ? $dailys->toArray()['links'] : [],  // Add pagination links
        ]);
    }
}