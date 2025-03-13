<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
Route::middleware(['api'])->group(function(){
    Route::post('/member/add', [MemberController::class, 'store']);
    Route::post('/member/edit', [MemberController::class, 'edit']);
    Route::post('/member/delete', [MemberController::class, 'delete']);
    Route::post('/member/get', [MemberController::class, 'index']);
    Route::post('/product/add', [ProductController::class, 'store']);
    Route::post('/product/edit', [ProductController::class, 'edit']);
    Route::post('/product/delete', [ProductController::class, 'delete']);
    Route::post('/product/get', [ProductController::class, 'index']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/account/register', [AccountController::class, 'store']);
    Route::post('/account/login', [AccountController::class, 'login']);
    Route::middleware('auth:sanctum')->post('/logout', [AccountController::class, 'logout']);
});
