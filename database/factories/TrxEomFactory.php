<?php

namespace Database\Factories;

use App\Models\TrxEom;
use Illuminate\Database\Eloquent\Factories\Factory;
use PhpOffice\PhpSpreadsheet\Calculation\Statistical\Distributions\Beta;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrxEom>
 */
class TrxEomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = TrxEom::class;

    private static $lastPeriodMonth = [];
    private static $lastPeriodYear = [];
    public function definition()
    {
        $uploadDate = $this->faker->dateTimeThisYear(); // Random date this year
        $processDate = $this->faker->dateTimeBetween($uploadDate); // Must be after upload_date

        $modifiedAt = $this->faker->dateTimeBetween($uploadDate); // Must be >= upload_date
        $productId = 50;
        $status = $this->faker->randomElement(['Draft', 'Approved']);

        $approvedDate = null;
        if ($status == 'Approved') {
            $approvedDate = $this->faker->dateTimeBetween($processDate);
        }

        if (!isset(self::$lastPeriodMonth[$productId])) {
            self::$lastPeriodMonth[$productId] = 1; // Mulai dari bulan pertama
            self::$lastPeriodYear[$productId] = 2023; // Tahun awal (sesuaikan dengan kebutuhan)
        }
        // Ambil bulan dan tahun terakhir untuk produk ini
        $periodMonth = self::$lastPeriodMonth[$productId];
        $periodYear = self::$lastPeriodYear[$productId];

        // Update urutan bulan dan tahun untuk produk ini
        if ($periodMonth == 12) {
            self::$lastPeriodMonth[$productId] = 1; // Reset ke bulan pertama
            self::$lastPeriodYear[$productId] += 1; // Naikkan tahun
        } else {
            self::$lastPeriodMonth[$productId] += 1; // Lanjutkan ke bulan berikutnya
        }

        return [
            'product_id' => $productId,
            'upload_date' => $uploadDate,
            'process_date' => $processDate,
            'approved_date' => $approvedDate,
            'status' => $status,
            'created_by' => 1,
            'created_at' => $this->faker->dateTimeThisYear(), // Tanggal pembuatan
            'attachment' => $this->faker->optional()->url, // URL attachment (opsional)
            'amount' => $this->faker->randomFloat(2, 8000000, 10000000), // Jumlah uang (contoh: 100.00 - 10000.00)
            'modified_by' => 1,
            'manager_id' => 1, // ID manajer
            'period_month' => $periodMonth,
            'period_year' => $periodYear, // Tahun periode
            'modified_at' => $modifiedAt,
            'title' => $this->faker->sentence(3), // Judul acak (3 kata)
        ];
    }
}
