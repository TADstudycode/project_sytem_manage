import { useState } from "react";
import api, {getCsrfToken} from "../api";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';
const Login = () => {
  const [formData, setFormData] = useState({email: "", password: ""});
  const navigate = useNavigate();
  const handleChange = (e) =>{
    setFormData({...formData, [e.target.name]: e.target.value});
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await getCsrfToken();
      const response = await api.post("/account/login", formData);
      localStorage.setItem("token", response.data.token);
      alert(response.data.message);
      navigate('/product');
    } catch (error) {
      alert("lỗi khi đăng nhập");
    }
  };
    return(
      <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="input-box">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Password" onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
        <a href="#" className="register-link">Register</a>
      </form>
    </div>  
    );
};
export default Login;