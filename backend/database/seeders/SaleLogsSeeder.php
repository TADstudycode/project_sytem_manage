<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SaleLogsSeeder extends Seeder
{
    public function run()
    {
        $statuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
        $products = [
            ['Laptop Dell XPS 13', 'Laptop', 22000000.00, 10.00],
            ['Apple MacBook Air M2', 'Laptop', 32000000.00, 10.00],
            ['Samsung 32GB DDR5', 'RAM', 2500000.00, 5.00],
            ['MSI RTX 4090 Gaming X', 'GPU', 55000000.00, 10.00],
            ['Intel Core i9-13900K', 'CPU', 17000000.00, 10.00],
            ['ASUS ROG Strix B660', 'Mainboard', 4500000.00, 8.00],
            ['Corsair 850W 80 Plus Gold', 'PSU', 3200000.00, 8.00],
            ['Samsung 980 PRO 1TB', 'SSD', 4200000.00, 5.00],
            ['Logitech G Pro X Superlight', 'Mouse', 2900000.00, 5.00],
            ['LG UltraGear 27" 144Hz', 'Monitor', 7200000.00, 8.00]
        ];

        $customers = [
            ['Nguyễn Văn A', '0987123456', 'nguyenvana@example.com', 'Hà Nội'],
            ['Trần Thị B', '0978234567', 'tranthib@example.com', 'TP Hồ Chí Minh'],
            ['Lê Hữu C', '0365123456', 'lehuuc@example.com', 'Đà Nẵng'],
            ['Hoàng Minh D', '0934234567', 'hoangminhd@example.com', 'Hải Phòng'],
            ['Phạm Quốc E', '0856123456', 'phamquoce@example.com', 'Cần Thơ']
        ];

        $data = [];
        for ($i = 0; $i < 50; $i++) {
            $product = $products[array_rand($products)];
            $customer = $customers[array_rand($customers)];
            $sale_price = $product[2];
            $VAT = ($product[3] / 100) * $sale_price;
            $total_price = $sale_price + $VAT;

            $data[] = [
                'id' => Str::uuid(),
                'product_name' => $product[0],
                'product_type' => $product[1],
                'sale_price' => $sale_price,
                'VAT' => $VAT,
                'total_price' => $total_price,
                'order_status' => $statuses[array_rand($statuses)],
                'customer_name' => $customer[0],
                'customer_phone' => $customer[1],
                'customer_email' => $customer[2],
                'customer_address' => $customer[3],
                'deleted' => 0,
                'description' => 'Giao dịch đơn hàng số ' . ($i + 1),
                'created_at' => Carbon::now()->subDays(rand(1, 30)),
                'updated_at' => Carbon::now(),
            ];
        }

        DB::table('sale_logs')->insert($data);
    }
}
