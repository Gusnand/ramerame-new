<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\SupportTicket;
use App\Models\Merchant;
use App\Models\Campaign;
use App\Models\Voucher;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
  public function index()
  {
    $today = Carbon::now();
    $firstDayOfMonth = Carbon::now()->startOfMonth();

    $data = [
      'userStats' => [
        'activeMembers' => User::where('role_id', 2)->where('accepted', 1)->count(),
        'incompleteMembers' => User::where('role_id', 2)->where('accepted', 0)->count(),
        'totalMembers' => User::where('role_id', 2)->count(),
      ],
      'productStats' => [
        'runningProducts' => Product::where('status', 'RUN')->count(),
        'offeredProducts' => Product::where('status', 'AC')->count(),
      ],
      'supportStats' => [
        'openTickets' => SupportTicket::where('status', 'O')->count(),
      ],
      'merchantStats' => [
        'totalMerchants' => Merchant::count(),
      ],
      'campaignStats' => [
        'totalCampaigns' => Campaign::count(),
        'activeCampaigns' => Campaign::where('status', 'active')->count(),
      ],
      'voucherStats' => [
        'today' => [
          'date' => $today->format('d F Y'),
          'claimed' => Voucher::whereDate('claimed_at', $today)->count(),
          'available' => Voucher::where('status', 'available')
            ->whereDate('created_at', $today)->count(),
          'used' => Voucher::whereDate('used_at', $today)->count(),
        ],
        'month' => [
          'date' => $today->format('F Y'),
          'claimed' => Voucher::whereBetween('claimed_at', [$firstDayOfMonth, $today])->count(),
          'available' => Voucher::where('status', 'available')
            ->whereBetween('created_at', [$firstDayOfMonth, $today])->count(),
          'used' => Voucher::whereBetween('used_at', [$firstDayOfMonth, $today])->count(),
        ],
      ],
    ];

    return Inertia::render('dashboard', [
      'dashboardData' => $data
    ]);
  }
}