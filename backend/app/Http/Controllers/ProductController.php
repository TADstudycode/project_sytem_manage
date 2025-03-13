<?php

namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:get',
                'offset' => 'integer|min:0',
                'paginate' => 'integer|min:1',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'status' => 1,
                    'message' => $validator->errors()
                ], 400);
            }
            $data = $validator->validated();
            $offset = $data['offset'] ?? 0;
            $paginate = $data['paginate'] ?? 12;
            $products = Product::offset($offset)->paginate($paginate);
            return response()->json([
                'status' => 0,
                'data' => $products,
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => 1,
                'message' => $th->getMessage()
            ], 400);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {   
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:add',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'product_code' => 'required|string|max:15',
            'status' => 'string|max:255',
            'import_price' => 'required|string|max:50',
            'sale_price' => 'nullable|string',
            'image' => 'nullable',
            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'quantity' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 1,
                'message' => $validator->errors()
            ], 400);
        }

        $data = $validator->validated();
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images/products', 'public');
            $data['image'] = $imagePath;
        }
        Product::create($data);
        return response()->json([
            'status' => 0,
            'message' => 'Product created successfully'
        ], 200);
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
    public function edit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:edit',
            'id' => 'required|exists:products,id',
            'name' => 'string|max:255',
            'category' => 'required|string|max:255',
            'product_code' => 'string|max:15',
            'status' => 'string|max:255',
            'import_price' => 'string|max:50',
            'sale_price' => 'nullable|string',
            'image' => 'nullable',
            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'quantity' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 1,
                'message' => $validator->errors()
            ], 400);
        }
        $data = $validator->validated();
        $product = Product::findOrFail($data['id']);
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ nếu có
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $imagePath = $request->file('image')->store('images/products', 'public');
            $data['image'] = $imagePath;
        }
        $product->update($data);
        return response()->json([
            'status' => 0,
            'message' => 'Product updated successfully'
        ], 200); 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function delete(Request $request){
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:delete',
            'id' => 'required|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 1,
                'message' => $validator->errors()
            ], 400);
        }

        $data = $validator->validated();
        Product::destroy($data['id']);

        return response()->json([
            'status' => 0,
            'message' => 'Product deleted successfully'
        ], 200);
    }
}
