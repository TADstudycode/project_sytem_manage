import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Login.css?v=1.1";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/account/register", formData);
            alert(response.data.message);
        } catch (error) {
            alert("Lỗi khi đăng ký");
        }
    };

    return (
        <div className="login-wrap col-8">
            <div className="icon-container">
                <div className="icon-area">
                    <h2 className="login-title">MANAGE_SYSTEM</h2>
                    <img src="/avatar.jpg" alt="Profile" />
                </div>
            </div>
            <div className="login-container">
                <div className="login-area">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Họ tên"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Mật khẩu"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <label htmlFor="password_confirmation">Confirm Password</label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                placeholder="Nhập lại mật khẩu"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit">Register</button>
                        <button className="register-link" onClick={() => navigate("/login")}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;