<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;

class LSBSteganography
{
  /**
   * Mengkonversi string ke binary
   */
  private function stringToBinary($string)
  {
    $binary = '';
    for ($i = 0; $i < strlen($string); $i++) {
      $binary .= str_pad(decbin(ord($string[$i])), 8, '0', STR_PAD_LEFT);
    }
    return $binary;
  }

  /**
   * Mengkonversi binary ke string
   */
  private function binaryToString($binary)
  {
    $string = '';
    for ($i = 0; $i < strlen($binary); $i += 8) {
      $chunk = substr($binary, $i, 8);
      $string .= chr(bindec($chunk));
    }
    return $string;
  }

  /**
   * Menyisipkan data ke dalam gambar menggunakan LSB
   * @param resource $image GD image resource
   * @param string $data Data yang akan disisipkan
   * @return resource Modified image resource
   */
  public function embedData($image, $data)
  {
    // Tambahkan delimiter untuk menandai akhir data
    $data .= "<<<EOF>>>";

    // Konversi data ke binary
    $binaryData = $this->stringToBinary($data);
    $dataLength = strlen($binaryData);

    // Dapatkan dimensi gambar
    $width = imagesx($image);
    $height = imagesy($image);

    // Counter untuk binary data
    $binaryIndex = 0;

    // Iterasi setiap pixel
    for ($y = 0; $y < $height && $binaryIndex < $dataLength; $y++) {
      for ($x = 0; $x < $width && $binaryIndex < $dataLength; $x++) {
        // Dapatkan warna pixel
        $rgb = imagecolorat($image, $x, $y);
        $colors = [
          'r' => ($rgb >> 16) & 0xFF,
          'g' => ($rgb >> 8) & 0xFF,
          'b' => $rgb & 0xFF
        ];

        // Modify LSB dari setiap komponen warna jika masih ada data
        foreach ($colors as $color => $value) {
          if ($binaryIndex < $dataLength) {
            // Ganti LSB dengan bit dari data
            $colors[$color] = ($value & 0xFE) | (int) $binaryData[$binaryIndex];
            $binaryIndex++;
          }
        }

        // Set warna pixel yang baru
        $newColor = imagecolorallocate($image, $colors['r'], $colors['g'], $colors['b']);
        imagesetpixel($image, $x, $y, $newColor);
      }
    }

    return $image;
  }

  /**
   * Mengekstrak data dari gambar yang telah disisipi
   * @param resource $image GD image resource
   * @return string Extracted data
   */
  public function extractData($image)
  {
    if (!$image) {
      throw new \Exception('Invalid image resource');
    }

    try {
      $binaryData = '';
      $width = imagesx($image);
      $height = imagesy($image);

      // Batasi ukuran data yang akan diekstrak
      $maxBinaryLength = 1000000; // ~1MB of binary data

      // Iterasi setiap pixel
      for ($y = 0; $y < $height; $y++) {
        for ($x = 0; $x < $width; $x++) {
          // Dapatkan warna pixel
          $rgb = imagecolorat($image, $x, $y);
          $colors = [
            ($rgb >> 16) & 0xFF,
            ($rgb >> 8) & 0xFF,
            $rgb & 0xFF
          ];

          // Ekstrak LSB dari setiap komponen warna
          foreach ($colors as $value) {
            $binaryData .= $value & 1;
          }

          // Cek apakah sudah mencapai delimiter
          if (strlen($binaryData) % 8 === 0) {
            $extractedString = $this->binaryToString($binaryData);
            if (strpos($extractedString, "<<<EOF>>>") !== false) {
              // Hapus delimiter dan return data
              return str_replace("<<<EOF>>>", "", $extractedString);
            }
          }

          // Batasi panjang data untuk mencegah memory overflow
          if (strlen($binaryData) > $maxBinaryLength) {
            throw new \Exception('Data too large, possible corruption');
          }
        }
      }

      throw new \Exception('EOF delimiter not found');
    } catch (\Exception $e) {
      Log::error('Error in extractData', [
        'error' => $e->getMessage()
      ]);
      throw $e;
    }
  }

  /**
   * Memvalidasi sertifikat menggunakan LSB
   * @param string $imagePath Path ke file gambar sertifikat
   * @return array|null Data yang diekstrak atau null jika tidak valid
   */
  public function validateCertificate($imagePath)
  {
    $image = null;
    try {
      // Set memory limit untuk gambar besar
      ini_set('memory_limit', '256M');

      // Load gambar dengan error suppression
      $image = @imagecreatefrompng($imagePath);
      if (!$image) {
        Log::error('Failed to create image from PNG', [
          'path' => $imagePath,
          'error' => error_get_last()
        ]);
        return null;
      }

      // Cek ukuran gambar
      $width = imagesx($image);
      $height = imagesy($image);

      if ($width * $height > 25000000) { // ~25MP limit
        Log::error('Image too large', [
          'width' => $width,
          'height' => $height
        ]);
        return null;
      }

      // Ekstrak data
      try {
        $extractedData = $this->extractData($image);
      } catch (\Exception $e) {
        Log::error('Failed to extract data from image', [
          'error' => $e->getMessage(),
          'path' => $imagePath
        ]);
        return null;
      }

      if (!$extractedData) {
        return null;
      }

      // Decode JSON data
      $decodedData = json_decode($extractedData, true);
      if (json_last_error() !== JSON_ERROR_NONE) {
        Log::error('Failed to decode JSON data', [
          'error' => json_last_error_msg(),
          'data' => $extractedData
        ]);
        return null;
      }

      // Validasi struktur data
      $requiredFields = ['name', 'certificate_no', 'generated_at', 'issuer'];
      foreach ($requiredFields as $field) {
        if (!isset($decodedData[$field])) {
          Log::error('Missing required field in certificate data', [
            'field' => $field
          ]);
          return null;
        }
      }

      return $decodedData;
    } catch (\Exception $e) {
      Log::error('Validation error in LSBSteganography', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      return null;
    } finally {
      // Bersihkan resource
      if ($image) {
        imagedestroy($image);
      }
    }
  }
}