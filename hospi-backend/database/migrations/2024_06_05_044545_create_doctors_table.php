<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDoctorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id(); // id: Unique identifier for the doctor
            $table->string('first_name'); // first_name: First name of the doctor
            $table->string('last_name'); // last_name: Last name of the doctor
            $table->string('specialization'); // specialization: Medical specialization of the doctor
            $table->string('license_number'); // license_number: Medical license number
            $table->string('phone'); // phone: Contact number of the doctor
            $table->string('email')->unique(); // email: Email address of the doctor
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
        Schema::dropIfExists('doctors');
    }
}