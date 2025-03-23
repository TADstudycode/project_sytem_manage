<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Discount;
class DiscountController extends Controller
{
    public function index()
    {
        $discounts = Discount::all();
        return response()->json($discounts);
    }

    // Thêm mã giảm giá
    public function create(Request $request)
    {
       try {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'required|string|min:0|max:100',
            'status' => 'required|in:active,inactive',
            'type' => 'required|in:fixed,percentage',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $discount = Discount::create($validatedData);

        return response()->json([
            'message' => 'Mã giảm giá đã được thêm thành công.',
            'discount' => $discount,
        ], 201);
       } catch (\Throwable $th) {
        //throw $th;
        return response()->json([
            'message' => 'Có lỗi xảy ra, vui lòng thử lại sau.'.$th->getMessage(),
        ], 500);
       }
    }

    public function update(Request $request)
    {
       try {
        $validatedData = $request->validate([
            'id' => 'required|string|max:255',
            'name' => 'nullable|string|max:255',
            'value' => 'nullable|string|min:0|max:100',
            'status' => 'nullable|in:active,inactive',
            'type' => 'nullable|in:fixed,percentage',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $discount = Discount::findOrFail($validatedData['id']);
        $discount->update($validatedData);

        return response()->json([
            'status' => 0,
            'message' => 'Mã giảm giá đã được cập nhật thành công.',
            'discount' => $discount,
        ], 200);
       } catch (\Throwable $th) {
        //throw $th;
        return response()->json([
            'status' => 1,
            'message' => 'Có lỗi xảy ra, vui lòng thử lại sau.'.$th->getMessage(),
        ], 500);
       }
    }

    public function delete(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'id' => 'required|string|max:255',
            ]);
            $discount = Discount::findOrFail($validatedData['id']);
            $discount->delete();
    
            return response()->json([
                'status' => 0,
                'message' => 'Mã giảm giá đã được xóa thành công.',
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => 1,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau.',
            ], 500);
        }
    }

}