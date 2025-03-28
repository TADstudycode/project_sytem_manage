<?php
namespace App\Services;

use Carbon\Carbon;
use Laravel\Sanctum\NewAccessToken;

class TokenService
{
    public function createToken($user, $name, array $abilities = ['*'])
    {
        $now = Carbon::now();
        $end = $now->copy()->endOfDay();
        $expirationMinutes = $now->diffInMinutes($end);
        $token = $user->createToken($name, $abilities, now()->addMinutes($expirationMinutes));

        return new NewAccessToken($token->accessToken, $token->plainTextToken);
    }
}