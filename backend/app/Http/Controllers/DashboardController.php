<?php

namespace App\Http\Controllers;
use App\Models\SaleLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
          $totalOrders = SaleLog::count();
          $totalRevenue = SaleLog::sum('total_price');
          $monthlySales = SaleLog::select(
              DB::raw('MONTH(created_at) as month'),
              DB::raw('SUM(total_price) as total')
          )->groupBy('month')->get();
          $productSales = SaleLog::select(
              'product_type',
              DB::raw('COUNT(*) as count')
          )->groupBy('product_type')->get();
          $orderStatus = SaleLog::select(
              'order_status',
              DB::raw('COUNT(*) as count')
          )->groupBy('order_status')->get();
          $dailyRevenue = SaleLog::select(
              DB::raw('DATE(created_at) as date'),
              DB::raw('SUM(total_price) as total')
          )->where('created_at', '>=', Carbon::now()->subDays(7))
          ->groupBy('date')->orderBy('date', 'ASC')->get();
          $totalCustomers = SaleLog::distinct('customer_email')->count('customer_email');
          return response()->json([
              'total_orders' => $totalOrders,
              'total_revenue' => $totalRevenue,
              'monthly_sales' => $monthlySales,
              'product_sales' => $productSales,
              'order_status' => $orderStatus,
              'daily_revenue' => $dailyRevenue,
              'total_customers' => $totalCustomers
          ]);
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
