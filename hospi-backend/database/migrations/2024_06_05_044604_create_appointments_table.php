<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppointmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id(); // id: Unique identifier for the appointment
            $table->unsignedBigInteger('patient_id'); // patient_id: Reference to the patient who booked the appointment
            $table->unsignedBigInteger('doctor_id'); // doctor_id: Reference to the doctor with whom the appointment is booked
            $table->dateTime('appointment_date'); // appointment_date: Date and time of the appointment
            $table->string('status'); // status: Status of the appointment (e.g., scheduled, completed, cancelled)
            $table->text('reason'); // reason: Reason for the appointment
            $table->timestamps(); // created_at and updated_at: Timestamps

            // Add foreign key constraints
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('appointments');
    }
}