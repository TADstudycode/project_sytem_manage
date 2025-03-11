<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->uuid("id");
            $table->string("name");
            $table->string("email");
            $table->string("phone");
            $table->string("image")->nullable();
            $table->string("address");
            $table->string("role");
            $table->string("description")->nullable();
            $table->tinyInteger("deleted")->default(0);
            $table->timestamps();
            $table->primary("id");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_member');
    }
};
