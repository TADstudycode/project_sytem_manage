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
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id');
            $table->string('order_number')->nullable();
            $table->string('product_id');
            $table->string('product_name');
            $table->string('product_type');
            $table->integer('quantity');
            $table->decimal('sale_price', 12, 2);
            $table->decimal('VAT', 12, 2);
            $table->decimal('total_price', 12, 2);            
            $table->string('order_status');
            $table->string('customer_name')->nullable();
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->string('customer_address')->nullable();
            $table->tinyInteger("deleted")->default(0);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->primary("id");
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order');
    }
};
