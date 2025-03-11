import Header  from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/dashboard")
            .then(response => setData(response.data))
            .catch(error => console.error("Lỗi lấy dữ liệu:", error));
    }, []);

    if (!data) return <p>Đang tải...</p>;
    return(
        <div className="app col-12">
                <Sidebar />
            <div className="main_content col-10">
                <Header />
                <div>
                    <h2>Dashboard</h2>
                    <p>Tổng đơn hàng: {data.total_orders}</p>
                    <p>Tổng doanh thu: {data.total_revenue} VND</p>
                    <Bar data={{
                        labels: data.order_status.map(item => item.order_status),
                        datasets: [{ label: "Số đơn hàng", data: data.order_status.map(item => item.count), backgroundColor: "blue" }]
                    }}/>
                    <Pie data={{
                        labels: data.product_sales.map(item => item.product_type),
                        datasets: [{ data: data.product_sales.map(item => item.count), backgroundColor: ["red", "blue", "green", "yellow"] }]
                    }}/>
                    <Line data={{
                        labels: data.daily_revenue.map(item => item.date),
                        datasets: [{ label: "Doanh thu", data: data.daily_revenue.map(item => item.total), borderColor: "green" }]
                    }}/>
                </div>
            </div>
        </div>
    )
};
export default Dashboard;