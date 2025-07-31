<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use App\Models\Campaign;
use App\Exports\UserActive;
use App\Exports\UserBuyerRecap;
use App\Exports\UserIncomplete;
use App\Exports\UserIncompleteSimple;
use App\Exports\MerchantReport;
use App\Exports\TotalCampaign;
use App\Exports\TotalCampaignByMerchant;
use App\Exports\SisaCampaign;
use App\Exports\VoucherTebus;
use App\Exports\VoucherTersediaHariIni;
use App\Exports\VoucherTersediaBulanIni;
use App\Exports\VoucherTerpakai;
use App\Helpers\HmacHelper;
use App\Services\SSO\SsoUserCommandService;
use App\Services\SSO\SsoUserWebExternalService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class DashboardController extends Controller
{

  public function index()
  {
    // $ssoQueryService = new SsoUserCommandService();
    // dd($ssoQueryService->registerNonMemberByJob());
    // dd($ssoQueryService->registerMember());
    // HmacHelper::generateByRequest('GET', 'new-api/m2m/check-user/nik', ["isNewAccount" => "1", "nik" => "0000000000000012"], '2024-02-27T02:37:36+00:00', 'db04a556-eff0-494c-b7d4-362645fa14e5', 'c35a31f7-567f-4c50-982c-8ace0430d3b0');
    // dd((new SsoUserWebExternalService())->getUserFindByEmail('9b8e16d4-5049-4ded-8530-2d46d2040864'));

    $user = Auth::user();
    $thisDay = Carbon::now()->format('l, j F Y');
    $thisMonth = Carbon::now()->format('F Y');

    $content = [
      'username' => $user->name,
      'campaignActive' => $this->getActiveCampaign(),
      'claimedHariIni' => $this->getVoucherClaimedHariIni(),
      'claimedBulanIni' => $this->getVoucherClaimedBulanIni(),
      'usedHariIni' => $this->getVoucherUsedHariIni(),
      'usedBulanIni' => $this->getVoucherUsedBulanIni(),
      'availableHariIni' => $this->getVoucherAvailableHariIni(),
      'availableBulanIni' => $this->getVoucherAvailableBulanIni(),
      'thisDay' => $thisDay,
      'thisMonth' => $thisMonth
    ];

    return Inertia::render('dashboard', [
      'dashboardData' => $content
    ]);
  }

  public function activeUser()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('user-active.xlsx');
    return response()->download('user-active.xlsx');
  }

  public function incompleteUser()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('user-incomplete.xlsx');
    return response()->download('user-incomplete.xlsx');
  }

  public function incompleteUserSimple()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('user-incomplete-simple.xlsx');
    return response()->download('user-incomplete-simple.xlsx');
  }

  public function buyerRecap()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('user-buyer-recap.xlsx');
    return response()->download('user-buyer-recap.xlsx');
  }

  public function merchant()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('merchant.xlsx');
    return response()->download('merchant.xlsx');
  }

  public function totalCampaign()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('total-campaign.xlsx');
    return response()->download('total-campaign.xlsx');
  }

  public function totalCampaignByMerchant($id)
  {
    $merchant = Merchant::where('id', $id)->first();
    $name = Str::slug($merchant->merchant_name);
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('total-campaign' . $name . '.xlsx');
    return response()->download('total-campaign' . $name . '.xlsx');
  }

  public function sisaCampaign()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('sisa-campaign.xlsx');
    return response()->download('sisa-campaign.xlsx');
  }

  public function voucherTebusHariIni()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('voucher-tebus-hari-ini.xlsx');
    return response()->download('voucher-tebus-hari-ini.xlsx');
  }

  public function voucherTebusBulanIni()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('voucher-tebus-bulan-ini.xlsx');
    return response()->download('voucher-tebus-bulan-ini.xlsx');
  }

  public function voucherTersediaHariIni()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('voucher-tersedia-hari-ini.xlsx');
    return response()->download('voucher-tersedia-hari-ini.xlsx');
  }


  public function voucherTersediaBulanIni()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('voucher-tersedia-bulan-ini.xlsx');
    return response()->download('voucher-tersedia-bulan-ini.xlsx');
  }

  public function voucherTerpakaiHariIni()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('voucher-terpakai-hari-ini.xlsx');
    return response()->download('voucher-terpakai-hari-ini.xlsx');
  }

  public function voucherTerpakaiBulanIni()
  {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    // isi data ke sheet
    $writer = new Xlsx($spreadsheet);
    $writer->save('voucher-terpakai-bulan-ini.xlsx');
    return response()->download('voucher-terpakai-bulan-ini.xlsx');
  }

  private function getActiveCampaign()
  {
    return Campaign::all()->filter(function ($value) {
      if (
        $value->is_published == 1 &&
        $value->status == 'APPROVED' &&
        $this->isBetween($value->start_date, $value->end_date)
      ) {
        return $value;
      }
    })->count();
  }

  private function getVoucherClaimedHariIni()
  {
    $campaign = Campaign::with('merchant', 'campaign_voucher')
      ->where('status', '!=', 'EXPIRED')
      ->get();

    $booked = $campaign->map(function ($item) {
      return $item
        ->campaign_voucher()
        ->where('status', 'BOOKED')
        ->whereBetween('redeem_at', [Carbon::now()->toDateString() . " 00:00:00", Carbon::now()->toDateString() . " 23:59:59"])
        ->count();
    });

    $claimed = $campaign->map(function ($item) {
      return $item
        ->campaign_voucher()
        ->where('status', 'CLAIMED')
        ->whereBetween('claimed_at', [Carbon::now()->toDateString() . " 00:00:00", Carbon::now()->toDateString() . " 23:59:59"])
        ->count();
    });

    return $booked->sum() + $claimed->sum();
  }

  private function getVoucherClaimedBulanIni()
  {
    $campaign = Campaign::with('merchant', 'campaign_voucher')
      ->where('status', '!=', 'EXPIRED')
      ->get();

    $booked = $campaign->map(function ($item) {
      return $item
        ->campaign_voucher()
        ->where('status', 'BOOKED')
        ->whereBetween('redeem_at', [Carbon::now()->firstOfMonth()->toDateString() . " 00:00:00", Carbon::now()->toDateString() . " 23:59:59"])
        ->count();
    });

    $claimed = $campaign->map(function ($item) {
      return $item
        ->campaign_voucher()
        ->where('status', 'CLAIMED')
        ->whereBetween('claimed_at', [Carbon::now()->firstOfMonth()->toDateString() . " 00:00:00", Carbon::now()->toDateString() . " 23:59:59"])
        ->count();
    });

    return $booked->sum() + $claimed->sum();
  }

  private function getVoucherUsedHariIni()
  {
    $campaign = Campaign::with('merchant', 'campaign_voucher')
      ->where('status', '!=', 'EXPIRED')
      ->where('status_req_publish', '!=', 'APPROVED_UNPUBLISH')
      ->get();

    $cash = $campaign->map(function ($item) {
      return $item
        ->campaign_voucher()
        ->where('status', 'CLAIMED')
        ->where('redeem_with', 'CASH')
        ->whereBetween('claimed_at', [
          Carbon::now()->toDateString() . " 00:00:00",
          Carbon::now()->toDateString() . " 23:59:59"
        ])
        ->count();
    });

    $point = $campaign->map(function ($item) {
      return $item
        ->campaign_voucher()
        ->where('status', 'CLAIMED')
        ->where('redeem_with', 'POINT')
        ->whereBetween('claimed_at', [
          Carbon::now()->toDateString() . " 00:00:00",
          Carbon::now()->toDateString() . " 23:59:59"
        ])
        ->count();
    });

    return $cash->sum() + $point->sum();
  }

  private function getVoucherUsedBulanIni()
  {
    $campaign = Campaign::with('merchant', 'campaign_voucher')
      ->where('status', '!=', 'EXPIRED')
      ->where('status_req_publish', '!=', 'APPROVED_UNPUBLISH')
      ->get();

    $cash = $campaign->map(function ($item) {
      return $item
        ->campaign_voucher()
        ->where('status', 'CLAIMED')
        ->where('redeem_with', 'CASH')
        ->whereBetween('claimed_at', [
          Carbon::now()->firstOfMonth()->toDateString() . " 00:00:00",
          Carbon::now()->toDateString() . " 23:59:59"
        ])
        ->count();
    });

    $point = $campaign->map(function ($item) {
      return $item
        ->campaign_voucher()
        ->where('status', 'CLAIMED')
        ->where('redeem_with', 'POINT')
        ->whereBetween('claimed_at', [
          Carbon::now()->firstOfMonth()->toDateString() . " 00:00:00",
          Carbon::now()->toDateString() . " 23:59:59"
        ])
        ->count();
    });

    return $cash->sum() + $point->sum();
  }

  private function getVoucherAvailableHariIni()
  {
    $campaign = Campaign::with('merchant', 'campaign_voucher')
      ->where('status', '!=', 'EXPIRED')
      ->where('status_req_publish', '!=', 'APPROVED_UNPUBLISH')
      ->get();

    $availableVoucher = $campaign->map(function ($item) {
      $voucherTebus = $item
        ->campaign_voucher()
        ->where('status', 'BOOKED')
        ->count();

      $voucherTerpakai = $item
        ->campaign_voucher()
        ->where('status', 'CLAIMED')
        ->count();

      if ($this->isBetween($item->start_date, $item->end_date)) {
        return ($item->number_of_voucher - $voucherTebus - $voucherTerpakai);
      }
    });

    return $availableVoucher->sum();
  }

  public function getVoucherAvailableBulanIni()
  {
    $campaign = Campaign::with('merchant', 'campaign_voucher')
      ->where('status', '!=', 'EXPIRED')
      ->where('status_req_publish', '!=', 'APPROVED_UNPUBLISH')
      ->whereBetween('start_date', [
        Carbon::now()->firstOfMonth()->toDateString(),
        Carbon::now()->endOfMonth()->toDateString()
      ])
      ->get();

    $availableVoucher = $campaign->map(function ($item) {
      $voucherTebus = $item
        ->campaign_voucher()
        ->where('status', 'BOOKED')
        ->count();

      $voucherTerpakai = $item
        ->campaign_voucher()
        ->where('status', 'CLAIMED')
        ->count();

      return ($item->number_of_voucher - $voucherTebus - $voucherTerpakai);
    });

    return $availableVoucher->sum();
  }

  private function getStatus($row)
  {
    if (
      $row->is_published == 1 &&
      $row->status == 'APPROVED' &&
      $this->isBetween($row->start_date, $row->end_date)
    ) {
      return 'active';
    }
    if ($row->status == 'APPROVED') {
      return 'approved';
    }
    if ($row->status == 'EXPIRED') {
      return 'expired';
    }
    return 'request';
  }

  private function isBetween($start_date, $end_date)
  {
    $start = Carbon::parse($start_date);
    $end = Carbon::parse($end_date);
    $result = Carbon::now()->between($start, $end);
    return $result;
  }
}
