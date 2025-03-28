<?php
namespace App\Http\Middleware;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;
class CheckTokenExpiration{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return response()->json(["status"=>0, "message" => "Unauthorized"], 401);
            }
            $accessToken = PersonalAccessToken::findToken($token);
            if (!$accessToken || ($accessToken->expires_at && now()->greaterThan($accessToken->expires_at))) {
                return response()->json(["status"=> 0,"message" => "Token expired. Please log in again."], 401);
            }

            return $next($request);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(["message" => $th->getMessage()], 500);
        }
    }
}
