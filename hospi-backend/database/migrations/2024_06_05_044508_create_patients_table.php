<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePatientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id(); // id: Unique identifier for the patient
            $table->string('first_name'); // first_name: First name of the patient
            $table->string('last_name'); // last_name: Last name of the patient
            $table->date('date_of_birth'); // date_of_birth: Date of birth of the patient
            $table->string('gender'); // gender: Gender of the patient
            $table->string('address'); // address: Residential address of the patient
            $table->string('phone'); // phone: Contact number of the patient
            $table->string('email')->unique(); // email: Email address of the patient
            $table->string('emergency_contact'); // emergency_contact: Emergency contact details
            $table->text('medical_history'); // medical_history: Brief medical history of the patient
            $table->timestamps(); // created_at and updated_at: Timestamps
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('patients');
    }
}