import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/dashboard")
            .then(response => setData(response.data))
            .catch(error => console.error("Lỗi lấy dữ liệu:", error));
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app col-12">
            <Sidebar />
            <div className="main_content col-10">
                <Header />
                <div className="dashboard-content">
                    <div className="stats">
                        <div className="stat-item">
                            <p>Total Customer</p>
                            <h3>{data.total_customers}</h3>
                            <p>up to {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="stat-item">
                            <p>Total Income</p>
                            <h3>{data.total_revenue} VND</h3>
                            <p>up to {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="stat-item">
                            <p>Total Outcome</p>
                            <h3>{data.total_outcome} _ _ _ VND</h3>
                            <p>up to {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="charts">
                        <div className="chart-item">
                            <h3>Total order status</h3>
                            <Bar data={{
                                labels: data.order_status.map(item => item.order_status),
                                datasets: [{
                                    label: "Số đơn hàng",
                                    data: data.order_status.map(item => item.count),
                                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384"]
                                }]
                            }} options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Status'
                                    }
                                }
                            }} />
                        </div>
                        <div className="chart-item">
                            <h3>Total sell </h3>
                            <Pie data={{
                                labels: data.product_sales.map(item => item.category),
                                datasets: [{
                                    data: data.product_sales.map(item => item.count),
                                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]
                                }]
                            }} options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Total sell'
                                    }
                                }
                            }} />
                        </div>
                        <div className="chart-item">
                            <h3>Income different</h3>
                            <Line data={{
                                labels: data.daily_revenue.map(item => item.date),
                                datasets: [{
                                    label: "Doanh thu",
                                    data: data.daily_revenue.map(item => item.total),
                                    borderColor: "#4BC0C0",
                                    backgroundColor: "rgba(75,192,192,0.4)"
                                }]
                            }} options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Income different'
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;