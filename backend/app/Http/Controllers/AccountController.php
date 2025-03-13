<?php

namespace App\Http\Controllers;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            'name' => 'required|string',
            'email' => "required|string|max:255",
            'password' => "required|string|min:8",
            'role' => "required|string",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 1,
                'message' => $validator->errors()
            ], 400);
        }

        $data = $validator->validated();
        $data['password'] = base64_encode($data['password']);
        Account::create($data);
        return response()->json([
            'status' => 0,
            'message' => 'Account created successfully'
        ], 200);
    }

    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = Account::where('email', $request->email)->first();
        if(!$user || !$this->checkPassword($request->password, $user->password)){
            throw ValidationException::withMessages([
                'email' => ['Thông tin đăng nhập không chính xác.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'token' => $token,
            'user' => $user
        ]);
    }

    protected function checkPassword($password, $hashedPassword){
        return base64_encode($password) === $hashedPassword;
    }

    public function logout(Request $request){
        $request->user()->tokens()->delete();
        return response()->json(['message' => "Đăng xuất thành công!"]);
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
}
