<?php

namespace App\Http\Controllers;
use App\Models\Account;
use App\Services\TokenService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Validation\ValidationException;
class AccountController extends Controller
{
    protected $tokenService;
    public function __construct(TokenService $tokenService){
        $this->tokenService = $tokenService;
    }
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
            'role' => "nullable|string",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 1,
                'message' => $validator->errors()
            ], 400);
        }

        $data = $validator->validated();
        $data['role'] = $data['role'] ?? 'user';
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
        $user_data = ["id"=>$user->id, "name"=>$user->name, "email"=>$user->email, "role"=>$user->role];
        $active_token = PersonalAccessToken::where('tokenable_id', $user->id)->where('tokenable_type', Account::class)->count();
        $max_token = 3;
        if($active_token > $max_token){
            PersonalAccessToken::where('tokenable_id', $user->id)
                               ->where('tokenable_type', Account::class)
                               ->orderBy('created_at', 'asc')
                               ->first()
                               ->delete();
        }
        // $token = $user->createToken('auth_token')->plainTextToken;
        $token = $this->tokenService->createToken($user, 'auth_token')->plainTextToken;
        return response()->json([
            'status' => 1,
            'message' => 'Đăng nhập thành công!',
            'token' => $token,
            'user' => $user_data
        ], 200);
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
