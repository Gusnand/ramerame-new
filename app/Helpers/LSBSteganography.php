<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;
use GdImage;

class LSBSteganography
{
  private const DELIMITER = "<<EOF>>";
  private const MAX_DATA_LENGTH = 2048;

  /**
   * Mengkonversi string ke binary dengan encoding yang tepat
   */
  private function stringToBinary(string $string): string
  {
    // Pastikan string dalam UTF-8
    $string = mb_convert_encoding($string, 'UTF-8', 'UTF-8');

    $binary = '';
    $length = strlen($string);

    for ($i = 0; $i < $length; $i++) {
      $binary .= str_pad(decbin(ord($string[$i])), 8, '0', STR_PAD_LEFT);
    }

    return $binary;
  }

  /**
   * Mengkonversi binary ke string dengan validasi
   */
  private function binaryToString(string $binary): string
  {
    $string = '';
    $length = strlen($binary);

    // Pastikan panjang binary adalah kelipatan 8
    if ($length % 8 !== 0) {
      throw new \Exception('Invalid binary data length');
    }

    for ($i = 0; $i < $length; $i += 8) {
      $chunk = substr($binary, $i, 8);
      if (!preg_match('/^[01]{8}$/', $chunk)) {
        throw new \Exception('Invalid binary data');
      }
      $string .= chr(bindec($chunk));
    }

    // Validasi UTF-8
    if (!mb_check_encoding($string, 'UTF-8')) {
      throw new \Exception('Invalid UTF-8 sequence');
    }

    return $string;
  }

  /**
   * Menyisipkan data ke dalam gambar menggunakan LSB
   */
  public function embedData(GdImage $image, string $data): GdImage
  {
    try {
      // Validasi panjang data
      if (strlen($data) > self::MAX_DATA_LENGTH) {
        throw new \Exception('Data too large to embed');
      }

      // Tambahkan delimiter
      $data .= self::DELIMITER;

      // Encode data sebagai UTF-8
      $data = mb_convert_encoding($data, 'UTF-8', 'UTF-8');

      // Konversi ke binary
      $binaryData = $this->stringToBinary($data);
      $dataLength = strlen($binaryData);

      // Dapatkan dimensi gambar
      $width = imagesx($image);
      $height = imagesy($image);

      // Validasi kapasitas
      $maxBits = $width * $height * 3; // 3 color channels
      if ($dataLength > $maxBits) {
        throw new \Exception('Image too small to hold data');
      }

      $binaryIndex = 0;

      // Iterasi setiap pixel
      for ($y = 0; $y < $height && $binaryIndex < $dataLength; $y++) {
        for ($x = 0; $x < $width && $binaryIndex < $dataLength; $x++) {
          $rgb = imagecolorat($image, $x, $y);
          $colors = [
            'r' => ($rgb >> 16) & 0xFF,
            'g' => ($rgb >> 8) & 0xFF,
            'b' => $rgb & 0xFF
          ];

          // Modify LSB dari setiap komponen warna
          foreach ($colors as $color => &$value) {
            if ($binaryIndex < $dataLength) {
              // Clear LSB and set new bit
              $value = ($value & 0xFE) | (int) $binaryData[$binaryIndex];
              $binaryIndex++;
            }
          }

          $newColor = imagecolorallocate($image, $colors['r'], $colors['g'], $colors['b']);
          imagesetpixel($image, $x, $y, $newColor);
        }
      }

      return $image;
    } catch (\Exception $e) {
      Log::error('Error in embedData', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      throw $e;
    }
  }

  /**
   * Mengekstrak data dari gambar yang telah disisipi
   */
  public function extractData(GdImage $image): string
  {
    try {
      $binaryData = '';
      $width = imagesx($image);
      $height = imagesy($image);

      // Batasi ukuran data yang akan diekstrak
      $maxBinaryLength = self::MAX_DATA_LENGTH * 8; // Convert to bits

      // Iterasi setiap pixel
      for ($y = 0; $y < $height; $y++) {
        for ($x = 0; $x < $width; $x++) {
          $rgb = imagecolorat($image, $x, $y);
          $colors = [
            ($rgb >> 16) & 0xFF,
            ($rgb >> 8) & 0xFF,
            $rgb & 0xFF
          ];

          // Ekstrak LSB dari setiap komponen warna
          foreach ($colors as $value) {
            $binaryData .= $value & 1;

            // Cek setiap 8 bit
            if (strlen($binaryData) % 8 === 0) {
              try {
                $extractedString = $this->binaryToString($binaryData);
                if (str_contains($extractedString, self::DELIMITER)) {
                  // Hapus delimiter dan return data
                  return str_replace(self::DELIMITER, '', $extractedString);
                }
              } catch (\Exception $e) {
                // Lanjutkan mencari jika data tidak valid
                continue;
              }
            }

            // Batasi panjang data
            if (strlen($binaryData) > $maxBinaryLength) {
              throw new \Exception('Data too large, possible corruption');
            }
          }
        }
      }

      throw new \Exception('Delimiter not found');
    } catch (\Exception $e) {
      Log::error('Error in extractData', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      throw $e;
    }
  }

  /**
   * Memvalidasi sertifikat menggunakan LSB
   */
  public function validateCertificate(string $imagePath): ?array
  {
    $image = null;
    try {
      // Set memory limit untuk gambar besar
      ini_set('memory_limit', '256M');

      // Load gambar
      $image = @imagecreatefrompng($imagePath);
      if (!$image) {
        Log::error('Failed to create image from PNG', [
          'path' => $imagePath,
          'error' => error_get_last()
        ]);
        return null;
      }

      // Ekstrak data
      $extractedData = $this->extractData($image);
      if (!$extractedData) {
        return null;
      }

      // Decode JSON data dengan error handling
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
          Log::error('Missing required field', ['field' => $field]);
          return null;
        }
      }

      return $decodedData;
    } catch (\Exception $e) {
      Log::error('Validation error', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      return null;
    } finally {
      if ($image) {
        imagedestroy($image);
      }
    }
  }
}