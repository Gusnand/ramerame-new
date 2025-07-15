<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Certificate;
use App\Models\Certifier;
use App\Models\TrxProductPurchase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class CertificateController extends Controller
{
  public function edit($productId, Request $request)
  {
    $product = Product::findOrFail($productId);

    // Mengambil atau membuat sertifikat untuk produk ini.
    $certificate = Certificate::firstOrCreate(
      ['product_id' => $product->id],
      [
        'cert_prefix' => 'RAMA-' . $product->id,
        'product_name' => $product->product_name,
        'product_duration' => $product->invest_month,
        'product_location' => $product->address,
        'cert_location' => 'Jakarta',
        'cert_date_string' => now()->translatedFormat('d F Y'),
      ]
    );

    $perPage = 10;
    $page = $request->input('page', 1);
    // Paginate certifier details (pemilik sertifikat)
    $certifiers = $certificate->details()->paginate($perPage, ['*'], 'page', $page);

    return Inertia::render('products/certificate', [
      'certificate' => $certificate,
      'product' => $product,
      'certifiers' => $certifiers,
    ]);
  }
  public function generateForProduct(Product $product)
  {
    $certificate = Certificate::firstOrCreate(
      ['product_id' => $product->id],
      ['cert_prefix' => 'RAMA-' . $product->id] // Contoh prefix default jika belum ada
    );

    $owners = $this->getOwners($product);
    $counter = Certifier::where('certificate_id', $certificate->id)->count() + 1;

    foreach ($owners as $owner) {
      // Cek apakah user sudah memiliki sertifikat untuk produk ini
      $existingCertifier = Certifier::where('user_id', $owner->user_id)
        ->where('certificate_id', $certificate->id)
        ->first();

      if (!$existingCertifier) {
        $user = User::with('user_infos')->find($owner->user_id);
        if (!$user)
          continue; // Lewati jika user tidak ditemukan

        // Generate nomor sertifikat dengan padding nol
        $certificateNumber = str_pad($counter, 5, '0', STR_PAD_LEFT);

        Certifier::create([
          'certificate_id' => $certificate->id,
          'user_id' => $owner->user_id,
          'name' => $user->name,
          'address' => $user->user_infos->address ?? 'Alamat tidak tersedia',
          'email' => $user->is_email_null ? null : $user->email,
          'total_slot' => $owner->ec_unit,
          'slot_price' => $product->ec_rate,
          'certificate_no' => $certificate->cert_prefix . '-' . $certificateNumber,
          'created_by' => 'super@mardika.com',
          'updated_by' => 'super@mardika.com',
        ]);

        $counter++;
      }
    }

    return redirect()->back()->with('success', 'Data sertifikat berhasil dibuat.');
  }

  public function download(Certifier $certifier)
  {
    // Memuat relasi header (Certificate)
    $certifier->load('header');
    $certificate = $certifier->header;

    // Path ke template dan font (pastikan file-file ini ada)
    $templatePath = storage_path('app/templates/certificate/Sertifikat-1000.png');
    $titleFont = storage_path('app/templates/fonts/libre-baskerville/LibreBaskerville-Regular.ttf');
    $certFont = storage_path('app/templates/fonts/montserrat/Montserrat-Regular.ttf');
    $nameFont = storage_path('app/templates/fonts/pacifico/Pacifico.ttf');
    $certFontLight = storage_path('app/templates/fonts/montserrat/Montserrat-Light.ttf');

    if (!file_exists($templatePath)) {
      abort(500, 'Template sertifikat tidak ditemukan.');
    }

    $im = imagecreatefrompng($templatePath);

    // Definisi Warna
    $blackColor = imagecolorallocate($im, 0, 0, 0);
    $goldColor = imagecolorallocatealpha($im, 188, 145, 59, 1);
    $blueColor = imagecolorallocate($im, 21, 66, 115);

    // Definisi Teks (sama seperti di controller lama)
    $ownerText = $certifier->name;
    $cellContent03 = 'Rp. ' . number_format(($certifier->total_slot * $certifier->slot_price), 2, ',', '.');

    // --- Mempertahankan semua pengaturan teks dari controller lama ---
    // Saya mengaktifkan semua baris imagettftext yang sebelumnya dikomentari
    imagettftext($im, 65, 0, 825, 463, $blueColor, $titleFont, 'SERTIFIKAT KEPEMILIKAN SLOT');
    imagettftext($im, 35, 0, 1300, 620, $blueColor, $certFont, 'No : ' . $certifier->certificate_no);
    imagettftext($im, 35, 0, 1380, 820, $blackColor, $certFont, 'Atas Nama Pemilik');

    $bbox = imagettfbbox(70, 0, $nameFont, $ownerText);
    $x = $bbox[0] + (imagesx($im) / 2) - ($bbox[4] / 2);
    imagettftext($im, 70, 0, $x, 930, $goldColor, $nameFont, $ownerText);

    $bbox = imagettfbbox(35, 0, $certFontLight, $certifier->address);
    $x = $bbox[0] + (imagesx($im) / 2) - ($bbox[4] / 2);
    imagettftext($im, 35, 0, $x, 1100, $blackColor, $certFontLight, $certifier->address);

    imagettftext($im, 35, 0, 700, 1300, $blackColor, $certFont, 'Sebagaimana tercatat dalam Daftar pemegang SLOT untuk Proyek / usaha');

    // ... (dan seterusnya, semua baris imagettftext lainnya dari kode lama Anda)
    // ... (pastikan semua variabel seperti $certificate->product_name dll. tersedia)
    imagettftext($im, 35, 0, 300, 1500, $blackColor, $certFontLight, 'Nama Proyek/Usaha');
    imagettftext($im, 35, 0, 1200, 1500, $blackColor, $certFontLight, 'Jumlah Slot');
    imagettftext($im, 35, 0, 1800, 1500, $blackColor, $certFontLight, 'Senilai');
    imagettftext($im, 35, 0, 2500, 1500, $blackColor, $certFontLight, 'Durasi Kontrak');

    imagettftext($im, 35, 0, 300, 1650, $blueColor, $certFont, $certificate->product_name);
    imagettftext($im, 35, 0, 1200, 1650, $blueColor, $certFont, $certifier->total_slot . ' SLOT');
    imagettftext($im, 35, 0, 1800, 1650, $blueColor, $certFont, $cellContent03);
    imagettftext($im, 35, 0, 2500, 1650, $blueColor, $certFont, $certificate->product_duration . ' BULAN');
    // --- Akhir dari pengaturan teks ---

    // Menangkap output gambar ke dalam variabel
    ob_start();
    imagepng($im);
    $image_data = ob_get_contents();
    ob_end_clean();

    imagedestroy($im);

    // Membuat response untuk download
    $fileName = 'Sertifikat-' . str_replace('/', '-', $certifier->certificate_no) . '.png';
    return Response::make($image_data, 200, [
      'Content-Type' => 'image/png',
      'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
    ]);
  }

  private function getOwners(Product $product)
  {
    // Menggunakan Collection untuk menyederhanakan logika
    return TrxProductPurchase::with('master')
      ->where('product_id', $product->id)
      ->whereHas('master', function ($query) {
        $query->where('status', 0); // Hanya ambil transaksi yang sukses
      })
      ->get()
      ->groupBy('user_id')
      ->map(function ($group) {
        return (object) [
          'user_id' => $group->first()->user_id,
          'ec_unit' => $group->sum('ec_unit'),
        ];
      })
      ->values()
      ->all();
  }
}