@ -1,35 +0,0 @@
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // id: Unique identifier for the user
            $table->string('name'); // name: Full name of the user
            $table->string('email')->unique(); // email: Email address of the user
            $table->string('password'); // password: Hashed password for user authentication
            $table->string('role'); // role: Role of the user (e.g., admin, doctor, receptionist, patient)
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
        Schema::dropIfExists('users');
    }
}