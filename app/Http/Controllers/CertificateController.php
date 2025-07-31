<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Certificate;
use App\Models\Certifier;
use App\Models\TrxProductPurchase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Log;
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

  public function update($id, Request $request)
  {
    $certificate = Certificate::findOrFail($id);
    
    $validated = $request->validate([
      'product_name' => 'required|string',
      'cert_prefix' => 'required|string',
      'product_location' => 'required|string',
      'product_duration' => 'required|numeric',
      'cert_location' => 'required|string',
      'cert_date_string' => 'required|string',
      'project_owner_company' => 'nullable|string',
      'project_owner_name' => 'nullable|string',
      'project_owner_title' => 'nullable|string',
      'admin_company' => 'nullable|string',
      'admin_owner' => 'nullable|string',
      'admin_title' => 'nullable|string',
    ]);

    $certificate->update($validated);

    return redirect()->back();
  }

  public function download(Certifier $certifier)
  {
    try {
      Log::info('Starting certificate download process', ['certifier_id' => $certifier->id]);

      // Memuat relasi header (Certificate)
      $certifier->load('header');
      $certificate = $certifier->header;

      // Path ke template dan font (pastikan file-file ini ada)
      $templatePath = storage_path('app/templates/certificate/Sertifikat-1000.png');
      $titleFont = storage_path('app/templates/fonts/libre-baskerville/LibreBaskerville-Regular.ttf');
      $certFont = storage_path('app/templates/fonts/montserrat/Montserrat-Regular.ttf');
      $nameFont = storage_path('app/templates/fonts/pacifico/Pacifico.ttf');
      $certFontLight = storage_path('app/templates/fonts/montserrat/Montserrat-Light.ttf');

      Log::info('Template and font paths', [
        'template' => $templatePath,
        'exists' => file_exists($templatePath)
      ]);

      // Cek keberadaan semua file yang diperlukan
      $requiredFiles = [
        $templatePath => 'Template sertifikat',
        $titleFont => 'Font untuk judul',
        $certFont => 'Font untuk sertifikat',
        $nameFont => 'Font untuk nama',
        $certFontLight => 'Font untuk teks ringan'
      ];

      foreach ($requiredFiles as $path => $description) {
        if (!file_exists($path)) {
          Log::error("Required file not found", ['path' => $path, 'description' => $description]);
          return response()->json([
            'error' => true,
            'message' => "$description tidak ditemukan di: $path"
          ], 500);
        }
      }

      // Buat salinan template untuk dimodifikasi
      $originalTemplate = imagecreatefrompng($templatePath);
      if (!$originalTemplate) {
        Log::error('Failed to create image from template', ['path' => $templatePath]);
        throw new \Exception('Failed to create image from template');
      }

      // Siapkan data steganografi
      $stegoData = [
        'name' => $certifier->name,
        'email' => $certifier->email,
        'address' => $certifier->address,
        'certificate_no' => $certifier->certificate_no,
        'generated_at' => now()->toIso8601String(),
        'issuer' => 'RAMERAME.CO.ID'
      ];

      Log::info('Preparing steganography data', ['data' => $stegoData]);

      // Konversi data ke JSON
      $stegoJson = json_encode($stegoData);

      // Sisipkan data menggunakan LSB di awal sebelum modifikasi gambar
      $lsb = new \App\Helpers\LSBSteganography();

      Log::info('Starting LSB embedding process');
      $im = $lsb->embedData($originalTemplate, $stegoJson);
      Log::info('LSB embedding completed');

      // Verify embedding immediately
      try {
        $verifyData = $lsb->extractData($im);
        $verifyJson = json_decode($verifyData, true);
        Log::info('Immediate verification result', ['extracted_data' => $verifyJson]);

        if (!$verifyJson || $verifyJson['certificate_no'] !== $stegoData['certificate_no']) {
          Log::warning('Immediate verification failed', [
            'expected' => $stegoData,
            'actual' => $verifyJson
          ]);
        }
      } catch (\Exception $e) {
        Log::error('Verification failed', ['error' => $e->getMessage()]);
      }

      // Definisi Warna
      $greyColor = imagecolorallocate($im, 247, 247, 247);
      $blackColor = imagecolorallocate($im, 0, 0, 0);
      $goldColor = imagecolorallocatealpha($im, 188, 145, 59, 1);
      $blueColor = imagecolorallocate($im, 21, 66, 115);

      // Definisi Teks
      $titleText = 'SERTIFIKAT KEPEMILIKAN SLOT';
      $certNoText = 'No : ' . $certifier->certificate_no;
      $ownerLabelText = 'Atas Nama Pemilik';
      $ownerText = $certifier->name;
      $ownerAddressText = $certifier->address;
      $claimLabelText = 'Sebagaimana Tercatat dalam Daftar Pemegang SLOT untuk Proyek/Usaha';

      $cellLabel01 = 'Nama Proyek/Usaha';
      $cellLabel02 = 'Jumlah Slot';
      $cellLabel03 = 'Senilai';
      $cellLabel04 = 'Durasi Kontrak';

      $cellContent01 = $certificate->product_name;
      $cellContent02 = $certifier->total_slot . ' SLOT';
      $cellContent03 = 'Rp. ' . number_format(($certifier->total_slot * $certifier->slot_price), 0, ',', '.');
      $cellContent04 = $certificate->product_duration . ' BULAN';

      $cellProjectAddress = $certificate->product_location;
      $cellProjectSince = 'Sejak Project Berjalan';

      $location = $certificate->cert_location . ',';
      $date = $certificate->cert_date_string;
      $ceo = $certificate->admin_title;
      $ceoName = $certificate->admin_owner;
      $projectOwnerSignatureLabel = 'Pemilik Project';
      $projectCompany = $certificate->project_owner_company;
      $projectOwner = $certificate->project_owner_name;
      $projectOwnerTitle = $certificate->project_owner_title;
      $companyTopSignature = 'Penyelenggara';
      $companyBottomSignature = $certificate->admin_company;

      // Judul Sertifikat
      imagettftext($im, 65, 0, 825, 463, $blueColor, $titleFont, $titleText);

      // Nomor Sertifikat
      imagettftext($im, 35, 0, 1300, 620, $blueColor, $certFont, $certNoText);

      // Garis di bawah nomor sertifikat
      imagesetthickness($im, 5);
      imageline($im, 825, 700, 2400, 700, $blackColor);
      imagesetthickness($im, 1);

      // Teks "Atas Nama Pemilik"
      imagettftext($im, 35, 0, 1380, 820, $blackColor, $certFont, $ownerLabelText);

      // Nama Pemilik (dengan centering yang diperbaiki)
      $bbox = imagettfbbox(70, 0, $nameFont, $ownerText);
      $x = $bbox[0] + (imagesx($im) / 2) - ($bbox[4] / 2) - 75; // Menambah offset ke kiri (dari -25 menjadi -75)
      imagettftext($im, 70, 0, $x, 930, $goldColor, $nameFont, $ownerText);

      // Alamat Pemilik
      $bbox = imagettfbbox(35, 0, $certFontLight, $ownerAddressText);
      $x = $bbox[0] + (imagesx($im) / 2) - ($bbox[4] / 2) - 85; // Menambah offset -50 untuk geser ke kiri
      imagettftext($im, 35, 0, $x, 1100, $blackColor, $certFontLight, $ownerAddressText);

      // Teks Deskripsi
      imagettftext($im, 35, 0, 735, 1300, $blackColor, $certFont, $claimLabelText);

      // Rectangle abu-abu untuk header tabel
      imagefilledrectangle($im, 100, 1400, 3300, 1550, $greyColor);

      // Label-label
      imagettftext($im, 35, 0, 300, 1500, $blackColor, $certFontLight, $cellLabel01);
      imagettftext($im, 35, 0, 1200, 1500, $blackColor, $certFontLight, $cellLabel02);
      imagettftext($im, 35, 0, 1800, 1500, $blackColor, $certFontLight, $cellLabel03);
      imagettftext($im, 35, 0, 2500, 1500, $blackColor, $certFontLight, $cellLabel04);

      // Nilai-nilai
      imagettftext($im, 35, 0, 300, 1650, $blueColor, $certFont, $cellContent01);
      imagettftext($im, 35, 0, 1200, 1650, $blueColor, $certFont, $cellContent02);
      imagettftext($im, 35, 0, 1800, 1650, $blueColor, $certFont, $cellContent03);
      imagettftext($im, 35, 0, 2500, 1650, $blueColor, $certFont, $cellContent04);

      // Alamat Proyek dan Keterangan
      imagettftext($im, 35, 0, 300, 1750, $blackColor, $certFontLight, $cellProjectAddress);
      imagettftext($im, 35, 0, 2500, 1750, $blackColor, $certFontLight, $cellProjectSince);

      // Lokasi dan Tanggal
      imagettftext($im, 35, 0, 1400, 1930, $blackColor, $certFontLight, $location);
      imagettftext($im, 35, 0, 1650, 1930, $blackColor, $certFontLight, $date);

      // Penandatangan Kiri
      imagettftext($im, 25, 0, 600, 2000, $blackColor, $certFontLight, $companyTopSignature);
      imagettftext($im, 25, 0, 600, 2050, $blackColor, $certFontLight, $companyBottomSignature);
      imagettftext($im, 30, 0, 600, 2250, $blueColor, $certFont, $ceoName);
      imagettftext($im, 30, 0, 600, 2310, $blackColor, $certFontLight, $ceo);

      // Penandatangan Kanan
      imagettftext($im, 25, 0, 2200, 2000, $blackColor, $certFontLight, $projectOwnerSignatureLabel);
      imagettftext($im, 30, 0, 2200, 2250, $blueColor, $certFont, $projectOwner);
      imagettftext($im, 25, 0, 2200, 2050, $blackColor, $certFontLight, $projectCompany);
      imagettftext($im, 30, 0, 2200, 2310, $blackColor, $certFontLight, $projectOwnerTitle);

      // Menangkap output gambar ke dalam variabel
      ob_start();
      imagepng($im);
      $image_data = ob_get_contents();
      ob_end_clean();

      imagedestroy($im);
      imagedestroy($originalTemplate);

      Log::info('Certificate generation completed successfully');

      // Membuat response untuk download
      $fileName = 'Sertifikat-' . str_replace('/', '-', $certifier->certificate_no) . '.png';
      return Response::make($image_data, 200, [
        'Content-Type' => 'image/png',
        'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
      ]);
    } catch (\Exception $e) {
      Log::error('Error in certificate download', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      throw $e;
    }
  }

  /**
   * Memvalidasi keaslian sertifikat
   */
  public function validateCertificate(Request $request)
  {
    try {
      Log::info('Starting certificate validation');

      if (!$request->hasFile('certificate')) {
        Log::warning('No certificate file found in request');
        return response()->json([
          'error' => true,
          'message' => 'File sertifikat tidak ditemukan'
        ], 400);
      }

      $file = $request->file('certificate');
      Log::info('Certificate file received', [
        'mime_type' => $file->getClientMimeType(),
        'size' => $file->getSize(),
        'original_name' => $file->getClientOriginalName()
      ]);

      // Validasi tipe file
      $mimeType = $file->getMimeType();
      if ($mimeType !== 'image/png') {
        Log::warning('Invalid file type', ['mime_type' => $mimeType]);
        return response()->json([
          'error' => true,
          'message' => 'File harus berupa gambar PNG'
        ], 400);
      }

      // Validasi ukuran file
      $maxSize = 10 * 1024 * 1024; // 10MB
      if ($file->getSize() > $maxSize) {
        Log::warning('File too large', ['size' => $file->getSize()]);
        return response()->json([
          'error' => true,
          'message' => 'Ukuran file terlalu besar (maksimal 10MB)'
        ], 400);
      }

      // Cek apakah file bisa dibaca
      if (!is_readable($file->getPathname())) {
        Log::error('File not readable', ['path' => $file->getPathname()]);
        return response()->json([
          'error' => true,
          'message' => 'File tidak dapat dibaca'
        ], 500);
      }

      // Coba buka gambar untuk memastikan file valid
      $image = @imagecreatefrompng($file->getPathname());
      if (!$image) {
        Log::error('Failed to create image from file', [
          'php_error' => error_get_last()
        ]);
        return response()->json([
          'error' => true,
          'message' => 'File PNG tidak valid atau rusak'
        ], 400);
      }
      imagedestroy($image);

      $lsb = new \App\Helpers\LSBSteganography();
      Log::info('Attempting to validate certificate using LSB');

      // Validasi sertifikat
      $extractedData = $lsb->validateCertificate($file->getPathname());
      Log::info('LSB validation result', ['extracted_data' => $extractedData]);

      if (!$extractedData) {
        Log::warning('Certificate validation failed - no data extracted');
        return response()->json([
          'error' => true,
          'message' => 'Sertifikat tidak valid atau telah dimodifikasi'
        ], 400);
      }

      Log::info('Certificate validation successful');
      return response()->json([
        'error' => false,
        'message' => 'Sertifikat valid',
        'data' => $extractedData
      ]);
    } catch (\Exception $e) {
      Log::error('Certificate validation error', [
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
      ]);

      return response()->json([
        'error' => true,
        'message' => 'Terjadi kesalahan saat memvalidasi sertifikat: ' . $e->getMessage()
      ], 500);
    }
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