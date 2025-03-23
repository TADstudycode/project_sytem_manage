<?php

namespace App\Http\Controllers;
use App\Models\Discount;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function get(){
        $orders = Order::all();
        return response()->json([
            'status' => 0,
            'data' => $orders
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $data = $request->json()->all();
        $products = $data['products'] ?? []; // Danh sách sản phẩm (mảng)
        if (empty($products)) {
            return response()->json([
                'status' => 1,
                'message' => 'Không có sản phẩm nào được chọn.'
            ], 400);
        }

        $orders = []; // Lưu danh sách đơn hàng đã tạo
        DB::beginTransaction(); // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu

        try {
            $orderNumber = 'ORD-' . strtoupper(uniqid());
            foreach ($products as $productData) {
                // Xác thực dữ liệu từng sản phẩm
                $validatedData = [
                    'product_id' => $productData['product_id'] ?? null,
                    'quantity' => $productData['quantity'] ?? 1,
                    'customer_name' => $data['customer_name'] ?? null,
                    'customer_phone' => $data['customer_phone'] ?? null,
                    'customer_email' => $data['customer_email'] ?? null,
                    'customer_address' => $data['customer_address'] ?? null,
                    'discount' => $data['discount'] ?? null,
                ];

                // Kiểm tra sản phẩm có tồn tại hay không
                $product = Product::findOrFail($validatedData['product_id']);
                if($validatedData['discount'] !== null){
                    $discount = Discount::where("name",$validatedData['discount'])->first();
                    if($discount->status == "inactive"){
                        throw new \Exception("Mã giảm giá đã hết hạn.");
                    }else{
                        if($discount->type == "percentage"){
                            $product->sale_price = $product->sale_price - $product->sale_price * $discount->value;
                            $discount_amount = $product->sale_price * $discount->value;
                        }else{
                            $product->sale_price = $product->sale_price - $discount->value;
                            $discount_amount = $discount->value;
                        }
                    }
                }
                // Kiểm tra tồn kho
                if ($product->quantity < $validatedData['quantity']) {
                    throw new \Exception("Sản phẩm {$product->name} không đủ số lượng trong kho.");
                }

                // Tính toán giá trị đơn hàng
                $totalPrice = $product->sale_price * $validatedData['quantity'];
                $VAT = $totalPrice * 0.1; // Giả sử VAT là 10%
                $finalPrice = $totalPrice + $VAT;

                // Tạo đơn hàng
                $order = Order::create([
                    'id' => (string) \Illuminate\Support\Str::uuid(),
                    'order_number' => $orderNumber,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_type' => $product->category,
                    'quantity' => $validatedData['quantity'],
                    'sale_price' => $product->sale_price,
                    'VAT' => $VAT,
                    'total_price' => $finalPrice,
                    'order_status' => 'Pending',
                    'discount_amount' => $discount_amount ?? 0,
                    'customer_name' => $validatedData['customer_name'],
                    'customer_phone' => $validatedData['customer_phone'],
                    'customer_email' => $validatedData['customer_email'],
                    'customer_address' => $validatedData['customer_address'],
                    'description' => $productData['description'] ?? null,
                ]);
                $product->decrement('quantity', $validatedData['quantity']);

                // Lưu đơn hàng vào danh sách
                $orders[] = $order;
            }

            DB::commit(); // Commit transaction nếu không có lỗi
            return response()->json([
                'status' => 0,
                'message' => 'Bạn đã đặt hàng thành công',
                'order_number' => $orderNumber,
                'orders' => $orders
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction nếu có lỗi
            return response()->json([
                'status' => 1,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $data = $request->json()->all();
    
        // Xác thực dữ liệu đầu vào
        $validatedData = $request->validate([
            'order_number' => 'required|exists:orders,order_number',
            'product_id' => 'nullable|exists:products,id', // Nếu muốn cập nhật một sản phẩm cụ thể
            'quantity' => 'nullable|integer|min:1',
            'order_status' => 'nullable|string|max:255',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:15',
            'customer_email' => 'nullable|email|max:255',
            'customer_address' => 'nullable|string|max:255',
        ]);
    
        DB::beginTransaction(); // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
    
        try {
            // Lấy danh sách các đơn hàng theo `order_number`
            $orders = Order::where('order_number', $validatedData['order_number'])->get();
    
            if ($orders->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Không tìm thấy đơn hàng với mã order_number này.'
                ], 404);
            }
    
            // Nếu có `product_id`, chỉ cập nhật sản phẩm cụ thể
            if (isset($validatedData['product_id'])) {
                $order = $orders->where('product_id', $validatedData['product_id'])->first();
    
                if (!$order) {
                    return response()->json([
                        'status' => 1,
                        'message' => 'Không tìm thấy sản phẩm trong đơn hàng.'
                    ], 404);
                }
    
                $this->updateOrder($order, $validatedData, $data);
            } else {
                // Cập nhật tất cả các sản phẩm trong đơn hàng
                foreach ($orders as $order) {
                    $this->updateOrder($order, $validatedData, $data);
                }
            }
    
            DB::commit(); // Commit transaction nếu không có lỗi
            return response()->json([
                'status' => 0,
                'message' => 'Cập nhật đơn hàng thành công.',
                'orders' => $orders
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction nếu có lỗi
            return response()->json([
                'status' => 1,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * Hàm hỗ trợ cập nhật một đơn hàng cụ thể.
     */
    private function updateOrder($order, $validatedData, $data)
    {
        $product = Product::findOrFail($order->product_id);
    
        // Nếu có cập nhật số lượng sản phẩm
        if (isset($validatedData['quantity'])) {
            $newQuantity = $validatedData['quantity'];
            $currentOrderQuantity = $order->quantity;
    
            // Kiểm tra tồn kho
            $availableStock = $product->quantity + $currentOrderQuantity; // Hoàn trả số lượng cũ trước khi kiểm tra
            if ($availableStock < $newQuantity) {
                throw new \Exception("Số lượng sản phẩm {$product->name} trong kho không đủ.");
            }
    
            // Cập nhật tồn kho sản phẩm
            $product->update([
                'quantity' => $availableStock - $newQuantity
            ]);
    
            // Cập nhật số lượng và tổng giá trị đơn hàng
            $order->update([
                'quantity' => $newQuantity,
                'total_price' => $order->sale_price * $newQuantity + $order->VAT
            ]);
        }
    
        // Nếu có cập nhật trạng thái đơn hàng
        if (isset($validatedData['order_status'])) {
            $order->update([
                'order_status' => $validatedData['order_status']
            ]);
        }
    
        // Nếu có cập nhật thông tin khách hàng
        if (isset($data['customer_name'])) {
            $order->update([
                'customer_name' => $data['customer_name']
            ]);
        }
        if (isset($data['customer_phone'])) {
            $order->update([
                'customer_phone' => $data['customer_phone']
            ]);
        }
        if (isset($data['customer_email'])) {
            $order->update([
                'customer_email' => $data['customer_email']
            ]);
        }
        if (isset($data['customer_address'])) {
            $order->update([
                'customer_address' => $data['customer_address']
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(Request $request)
    {
        try {
            $data = $request->json()->all();
            // Lấy danh sách các đơn hàng theo `order_number`
            $orders = Order::where('order_number', $data['order_number'])->get();
    
            if ($orders->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Không tìm thấy đơn hàng với mã order_number này.'
                ], 404);
            }
    
            // Hoàn trả số lượng sản phẩm trong kho và xóa đơn hàng
            foreach ($orders as $order) {
                $product = Product::find($order->product_id);
                if ($product && $order->order_status !== 'Completed') {
                    $product->increment('quantity', $order->quantity); // Hoàn trả số lượng
                }
                $order->delete();
            }
    
            return response()->json([
                'status' => 0,
                'message' => 'Đơn hàng đã bị xóa thành công.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 1,
                'message' => 'Đã xảy ra lỗi khi xóa đơn hàng: ' . $e->getMessage()
            ], 500);
        }
    }
}
