<?php

namespace App\Http\Controllers\Super;

use App\Product;
use App\TrxProductPurchase;
use App\User;
use App\Certifier;
use App\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use File;
use App\Mail\SuperCertificateMail;

class CertificateController extends Controller
{
  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {
  }

  public function fillMembers($productId)
  {
    $owners = $this->getOwners($productId);
    $product = Product::find($productId);
    $cert = Certificate::where('product_id', $productId)->first();

    $counter = 1;
    $cert_no = '';
    foreach ($owners as $owner) {
      $search = Certifier::where('user_id', $owner->user_id)
        ->where('certificate_id', $cert->id)
        ->first();

      if (empty($search)) {
        $user = User::with(['user_infos'])->find($owner->user_id);
        $certifier = new Certifier();

        switch (strlen($counter)) {
          case 1:
            $cert_no = '0000' . $counter;
            break;
          case 2:
            $cert_no = '000' . $counter;
            break;
          case 3:
            $cert_no = '00' . $counter;
            break;
          case 4:
            $cert_no = '0' . $counter;
            break;
          default:
            $cert_no = $counter;
            break;
        }

        $certifier->certificate_id = $cert->id;
        $certifier->user_id = $owner->user_id;
        $certifier->name = $user->name;
        $certifier->address = $user->user_infos->address;
        $certifier->email = $user->is_email_null ? null : $user->email;
        $certifier->total_slot = $owner->ec_unit;
        $certifier->slot_price = $product->ec_rate;
        $certifier->certificate_no = $cert->cert_prefix . '-' . $cert_no;
        $certifier->created_at = Carbon::now()->toDateTimeString();
        $certifier->updated_at = Carbon::now()->toDateTimeString();
        $certifier->created_by = 'super@mardika.com';
        $certifier->updated_by = 'super@mardika.com';

        $certifier->save();
        $counter++;
      }
    }
  }

  private function getOwners($id)
  {
    $owners = [];

    $details = TrxProductPurchase::with(['master'])
      ->where('product_id', $id)->get();

    foreach ($details as $det) {
      $flag = 0;

      for ($i = 0; $i < count($owners); $i++) {
        if ($owners[$i]->user_id == $det->user_id) {
          $flag = 1;

          if ($det->master->status == 0) {
            $owners[$i]->ec_unit += $det->ec_unit;
            break;
          }
        }
      }

      if ($flag == 0) {
        if ($det->master->status == 0) {
          array_push($owners, (object) [

            'ec_unit' => $det->ec_unit,
            'user_id' => $det->user_id,
            'product_id' => $det->product_id

          ]);
        }
      }
    }

    return $owners;
  }

  public function test()
  {

    // Create a 300x150 image
    $im = imagecreatetruecolor(300, 150);
    $black = imagecolorallocate($im, 0, 0, 0);
    $white = imagecolorallocate($im, 255, 255, 255);

    // Set the background to be white
    imagefilledrectangle($im, 0, 0, 299, 299, $white);

    // Path to our font file
    $font = storage_path() . '/fonts/montserrat/Montserrat-Regular.ttf';

    // First we create our bounding box for the first text
    $bbox = imagettfbbox(10, 45, $font, 'Powered by PHP ' . phpversion());

    // This is our cordinates for X and Y
    $x = $bbox[0] + (imagesx($im) / 2) - ($bbox[4] / 2) - 25;
    $y = $bbox[1] + (imagesy($im) / 2) - ($bbox[5] / 2) - 5;

    // Write it
    imagettftext($im, 10, 45, $x, $y, $black, $font, 'Powered by PHP ' . phpversion());

    // Create the next bounding box for the second text
    $bbox = imagettfbbox(10, 45, $font, 'and Zend Engine ' . zend_version());

    // Set the cordinates so its next to the first text
    $x = $bbox[0] + (imagesx($im) / 2) - ($bbox[4] / 2) + 10;
    $y = $bbox[1] + (imagesy($im) / 2) - ($bbox[5] / 2) - 5;

    // Write it
    imagettftext($im, 10, 45, $x, $y, $black, $font, 'and Zend Engine ' . zend_version());

    // Output to browser
    header('Content-Type: image/png');

    imagepng($im);
    imagedestroy($im);
  }

  public function view($certificateId, $certifierId)
  {
    $details = Certifier::with(['header'])->findOrFail($certifierId);
    $cert = $details->header;
    $im = imagecreatefrompng(storage_path() . '/certificate/Sertifikat-1000.png');

    $greyColor = imagecolorallocate($im, 247, 247, 247);
    $blackColor = imagecolorallocate($im, 0, 0, 0);
    $goldColor = imagecolorallocatealpha($im, 188, 145, 59, 1);
    $blueColor = imagecolorallocate($im, 21, 66, 115);

    $titleFont = storage_path() . '/fonts/libre-baskerville/LibreBaskerville-Regular.ttf';
    $certFont = storage_path() . '/fonts/montserrat/Montserrat-Regular.ttf';
    $nameFont = storage_path() . '/fonts/pacifico/Pacifico.ttf';
    $certFontLight = storage_path() . '/fonts/montserrat/Montserrat-Light.ttf';

    $titleText = 'SERTIFIKAT KEPEMILIKAN SLOT';
    $certNoText = 'No : ' . $details->certificate_no;
    $ownerLabelText = 'Atas Nama Pemilik';
    $ownerText = $details->name;
    $ownerAddressText = $details->address;
    $claimLabelText = 'Sebagaimana tercatat dalam Daftar pemegang SLOT untuk Proyek / usaha';

    $cellLabel01 = 'Nama Proyek/Usaha';
    $cellLabel02 = 'Jumlah Slot';
    $cellLabel03 = 'Senilai';
    $cellLabel04 = 'Durasi Kontrak';

    $cellContent01 = $cert->product_name;
    $cellContent02 = $details->total_slot . ' SLOT';
    $cellContent03 = 'Rp. ' . number_format(($details->total_slot * $details->slot_price), 2, ',', '.');
    $cellContent04 = $cert->product_duration . ' BULAN';

    $cellProjectAddress = $cert->product_location;
    $cellProjectSince = 'Sejak Project Berjalan';

    $location = $cert->cert_location . ',';
    $date = $cert->cert_date_string;
    $ceo = $cert->admin_title;
    $ceoName = $cert->admin_owner;
    $projectOwnerSignatureLabel = 'Pemilik Project';
    $projectCompany = $cert->project_owner_company;
    $projectOwner = $cert->project_owner_name;
    $projectOwnerTitle = $cert->project_owner_title;
    $companyTopSignature = 'Penyelenggara';
    $companyBottomSignature = $cert->admin_company;

    #imagettftext($im, 65, 0, 825, 463, $blueColor, $titleFont, $titleText);
    #imagettftext($im, 35, 0, 1300, 620, $blueColor, $certFont, $certNoText);

    #imagettftext($im, 35, 0, 1380, 820, $blackColor, $certFont, $ownerLabelText);

    $bbox = imagettfbbox(70, 0, $nameFont, $ownerText);
    $x = $bbox[0] + (imagesx($im) / 2) - ($bbox[4] / 2) - 25;

    imagettftext($im, 70, 0, $x, 850, $goldColor, $nameFont, $ownerText);

    #$bbox = imagettfbbox(35, 0, $certFontLight, $ownerAddressText);
    #$x = $bbox[0] + (imagesx($im) / 2) - ($bbox[4] / 2);

    #imagettftext($im, 35, 0, $x, 1100, $blackColor, $certFontLight, $ownerAddressText);
    #imagettftext($im, 35, 0, 700, 1300, $blackColor, $certFont, $claimLabelText);

    #imagesetthickness($im, 5);
    #imageline($im, 825,700,2400,700,$blackColor);

    #imagefilledrectangle($im, 100, 1400,3300,1550, $greyColor);

    #imagesetthickness($im, 1);

    #imagettftext($im, 35, 0, 300, 1500, $blackColor, $certFontLight, $cellLabel01);

    #imagettftext($im, 35, 0, 1200, 1500, $blackColor, $certFontLight, $cellLabel02);

    #imagettftext($im, 35, 0, 1800, 1500, $blackColor, $certFontLight, $cellLabel03);

    #imagettftext($im, 35, 0, 2500, 1500, $blackColor, $certFontLight, $cellLabel04);

    #imagettftext($im, 35, 0, 300, 1650, $blueColor, $certFont, $cellContent01);
    #imagettftext($im, 35, 0, 1200, 1650, $blueColor, $certFont, $cellContent02);
    #imagettftext($im, 35, 0, 1800, 1650, $blueColor, $certFont, $cellContent03);
    #imagettftext($im, 35, 0, 2500, 1650, $blueColor, $certFont, $cellContent04);

    #imagettftext($im, 35, 0, 300, 1750, $blackColor, $certFontLight, $cellProjectAddress);
    #imagettftext($im, 35, 0, 2500, 1750, $blackColor, $certFontLight, $cellProjectSince);

    imagettftext($im, 35, 0, 1400, 1930, $blackColor, $certFontLight, $location);
    imagettftext($im, 35, 0, 1650, 1930, $blackColor, $certFontLight, $date);

    imagettftext($im, 35, 0, 600, 2030, $blackColor, $certFontLight, $companyTopSignature);
    imagettftext($im, 35, 0, 600, 2100, $blackColor, $certFontLight, $companyBottomSignature);
    imagettftext($im, 35, 0, 600, 2310, $blackColor, $certFontLight, $ceo);
    imagettftext($im, 35, 0, 600, 2250, $blueColor, $certFont, $ceoName);

    imagettftext($im, 35, 0, 2400, 2030, $blackColor, $certFontLight, $projectOwnerSignatureLabel);
    imagettftext($im, 35, 0, 2400, 2250, $blueColor, $certFont, $projectOwner);
    imagettftext($im, 35, 0, 2400, 2100, $blackColor, $certFontLight, $projectCompany);
    imagettftext($im, 35, 0, 2400, 2310, $blackColor, $certFontLight, $projectOwnerTitle);

    header("Content-Type: image/png");
    imagepng($im);
    imagedestroy($im);
  }

  public function index($certificateId)
  {
    $cert = Certificate::with(['details'])->findOrFail($certificateId);

    foreach ($cert->details as $details) {
      $im = imagecreatefrompng(storage_path() . '/certificate/Sertifikat-3.png');

      $greyColor = imagecolorallocate($im, 247, 247, 247);
      $blackColor = imagecolorallocate($im, 0, 0, 0);
      $goldColor = imagecolorallocatealpha($im, 188, 145, 59, 1);
      $blueColor = imagecolorallocate($im, 21, 66, 115);

      $titleFont = storage_path() . '/fonts/libre-baskerville/LibreBaskerville-Regular.ttf';
      $certFont = storage_path() . '/fonts/montserrat/Montserrat-Regular.ttf';
      $nameFont = storage_path() . '/fonts/pacifico/Pacifico.ttf';
      $certFontLight = storage_path() . '/fonts/montserrat/Montserrat-Light.ttf';

      $titleText = 'SERTIFIKAT KEPEMILIKAN SLOT';
      $certNoText = 'No : ' . $details->certificate_no;
      $ownerLabelText = 'Atas Nama Pemilik';
      $ownerText = $details->name;
      $ownerAddressText = $details->address;
      $claimLabelText = 'Sebagaimana tercatat dalam Daftar pemegang SLOT untuk Proyek / usaha';

      $cellLabel01 = 'Nama Proyek/Usaha';
      $cellLabel02 = 'Jumlah Slot';
      $cellLabel03 = 'Senilai';
      $cellLabel04 = 'Durasi Kontrak';

      $cellContent01 = $cert->product_name;
      $cellContent02 = $details->total_slot . ' SLOT';
      $cellContent03 = 'Rp. ' . number_format(($details->total_slot * $details->slot_price), 2, ',', '.');
      $cellContent04 = $cert->product_duration . ' BULAN';

      $cellProjectAddress = $cert->product_location;
      $cellProjectSince = 'Sejak Project Berjalan';

      $location = $cert->cert_location . ',';
      $date = $cert->cert_date_string;
      $ceo = $cert->admin_title;
      $ceoName = $cert->admin_owner;
      $projectOwnerSignatureLabel = 'Pemilik Project';
      $projectCompany = $cert->project_owner_company;
      $projectOwner = $cert->project_owner_name;
      $projectOwnerTitle = $cert->project_owner_title;
      $companyTopSignature = 'Penyelenggara';
      $companyBottomSignature = $cert->admin_company;

      imagettftext($im, 65, 0, 825, 463, $blueColor, $titleFont, $titleText);
      imagettftext($im, 35, 0, 1300, 620, $blueColor, $certFont, $certNoText);

      imagettftext($im, 35, 0, 1380, 820, $blackColor, $certFont, $ownerLabelText);

      $bbox = imagettfbbox(70, 0, $nameFont, $ownerText);
      $x = $bbox[0] + (imagesx($im) / 2) - ($bbox[4] / 2) - 25;

      imagettftext($im, 70, 0, $x, 930, $goldColor, $nameFont, $ownerText);

      $bbox = imagettfbbox(35, 0, $certFontLight, $ownerAddressText);
      $x = $bbox[0] + (imagesx($im) / 2) - ($bbox[4] / 2);

      imagettftext($im, 35, 0, $x, 1100, $blackColor, $certFontLight, $ownerAddressText);
      imagettftext($im, 35, 0, 700, 1300, $blackColor, $certFont, $claimLabelText);

      imagesetthickness($im, 5);
      imageline($im, 825, 700, 2400, 700, $blackColor);

      imagefilledrectangle($im, 100, 1400, 3300, 1550, $greyColor);

      imagesetthickness($im, 1);

      imagettftext($im, 35, 0, 300, 1500, $blackColor, $certFontLight, $cellLabel01);

      imagettftext($im, 35, 0, 1200, 1500, $blackColor, $certFontLight, $cellLabel02);

      imagettftext($im, 35, 0, 1800, 1500, $blackColor, $certFontLight, $cellLabel03);

      imagettftext($im, 35, 0, 2500, 1500, $blackColor, $certFontLight, $cellLabel04);

      imagettftext($im, 35, 0, 300, 1650, $blueColor, $certFont, $cellContent01);
      imagettftext($im, 35, 0, 1200, 1650, $blueColor, $certFont, $cellContent02);
      imagettftext($im, 35, 0, 1800, 1650, $blueColor, $certFont, $cellContent03);
      imagettftext($im, 35, 0, 2500, 1650, $blueColor, $certFont, $cellContent04);

      imagettftext($im, 35, 0, 300, 1750, $blackColor, $certFontLight, $cellProjectAddress);
      imagettftext($im, 35, 0, 2500, 1750, $blackColor, $certFontLight, $cellProjectSince);

      imagettftext($im, 35, 0, 1400, 1930, $blackColor, $certFontLight, $location);
      imagettftext($im, 35, 0, 1650, 1930, $blackColor, $certFontLight, $date);

      imagettftext($im, 25, 0, 600, 2000, $blackColor, $certFontLight, $companyTopSignature);
      imagettftext($im, 25, 0, 600, 2050, $blackColor, $certFontLight, $companyBottomSignature);
      imagettftext($im, 30, 0, 600, 2310, $blackColor, $certFontLight, $ceo);
      imagettftext($im, 30, 0, 600, 2250, $blueColor, $certFont, $ceoName);

      imagettftext($im, 25, 0, 2200, 2000, $blackColor, $certFontLight, $projectOwnerSignatureLabel);
      imagettftext($im, 30, 0, 2200, 2250, $blueColor, $certFont, $projectOwner);
      imagettftext($im, 25, 0, 2200, 2050, $blackColor, $certFontLight, $projectCompany);
      imagettftext($im, 30, 0, 2200, 2310, $blackColor, $certFontLight, $projectOwnerTitle);

      #header("Content-Type: image/jpeg");
      imagepng($im, storage_path() . '/app/certificate/' . $cert->product_id . '/' . $details->certificate_no . '.png');
      imagedestroy($im);
    }
  }

  public function sendMail($certifierId)
  {
    $details = Certifier::with(['header', 'user'])->findOrFail($certifierId);

    $user = $details->user;
    $certificate = $details->header;

    $payload = (object) [
      'message' => $certificate->template_email
    ];

    $details->status = 'SENT';
    $details->email_sent_at = Carbon::now()->toDateTimeString();
    $details->save();

    if ($user->is_email_null != 1) {
      Mail::to($user->email)->cc('ramerame.biz@gmail.com')->bcc('gede.unique@gmail.com')->send(new SuperCertificateMail($user, $certificate, $details, $payload));
    }
    #Mail::to('komang.mardika@gmail.com')->send(new SuperCertificateMail($user, $certificate, $details, $payload));
    return redirect()->route('super.certificate.editor', ['id' => $details->header->product_id])->with('save_message_success', 'Email berhasil dikirim');
  }

  public function editor($productId)
  {
    $product = Product::findOrFail($productId);
    $cert = Certificate::with(['details'])->where('product_id', $productId)->first();
    $user = Auth::user();

    $content = [
      'username' => $user->name,
      'data' => $cert,
      'product' => $product,
      'update_url' => ''
    ];

    return view('super.product.certificate', $content);
  }

  public function save(Request $request)
  {
    dd($request);
  }

  public function update(Request $request)
  {
    $certificate = Certificate::where('product_id', $request->input('product_id'))->first();


    $certificate->template_email = $request->input('message');

    $certificate->attachment1 = $this->saveAttachment($request, 'attachment1', $request->input('product_id'));
    $certificate->attachment2 = $this->saveAttachment($request, 'attachment2', $request->input('product_id'));
    $certificate->attachment3 = $this->saveAttachment($request, 'attachment3', $request->input('product_id'));
    $certificate->attachment4 = $this->saveAttachment($request, 'attachment4', $request->input('product_id'));

    $certificate->cert_date_string = $request->input('cert_date_string');

    $certificate->save();

    return redirect()->route('super.certificate.editor', ['id' => $request->input('product_id')])->with('save_message_success', 'Data berhasil disimpan');
  }

  private function saveAttachment($request, $name, $productId)
  {
    $filename = '';

    if ($request->hasFile($name)) {
      $path = storage_path() . '/app/certificate/' . $productId;

      $pdf = $request->file($name);

      File::isDirectory($path) or Storage::disk('local')->makeDirectory('certificate/' . $productId);
      switch ($name) {
        case 'attachment1':
          $filename = 'perjanjian.pdf';
          break;
        case 'attachment2':
          $filename = 'term-kondisi.pdf';
          break;
        case 'attachment3':
          $filename = 'proposal.pdf';
          break;
        case 'attachment4':
          $filename = 'lainnya.pdf';
          break;
      }


      Storage::disk('local')->putFileAs('certificate/' . $productId, $pdf, $filename);
    }

    return $filename;
  }

  public function pdf_viewer($productId, $filename)
  {
    $path = storage_path() . '/app/certificate/' . $productId;

    return Storage::disk('local')->download('certificate/' . $productId . '/' . $filename);
  }
}
