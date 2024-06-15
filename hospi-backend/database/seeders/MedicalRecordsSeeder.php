<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medical_Record;
use Faker\Factory as Faker;

class MedicalRecordsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Let's generate 20 medical records for demonstration
        for ($i = 0; $i < 20; $i++) {
            Medical_Record::create([
                'patient_id' => rand(3,4), // Assuming patients exist with IDs 1 to 10
                'doctor_id' => rand(2,4),   // Assuming doctors exist with IDs 1 to 5
                'visit_date' => $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
                'diagnosis' => $faker->sentence,
                'treatment' => $faker->paragraph,
                'notes' => $faker->paragraphs(rand(1, 3), true),
            ]);
        }
    }
}
