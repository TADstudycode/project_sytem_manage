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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid("id");
            $table->string("name");
            $table->string("category");
            $table->string("product_code")->unique();
            $table->string("status")->default(0);
            $table->string("import_price");
            $table->string("sale_price");
            $table->string("image")->nullable();
            $table->string("description")->nullable();
            $table->string("brand")->nullable();
            $table->integer("quantity")->default(1);
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
        Schema::dropIfExists('table_product');
    }
};
