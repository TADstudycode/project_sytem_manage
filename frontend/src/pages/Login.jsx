import { useState } from "react";
import api, {getCsrfToken} from "../api";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css?v=1.1';
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
      navigate('/dashboard');
    } catch (error) {
      alert("lỗi khi đăng nhập");
    }
  };
    return(
      <div className="login-wrap col-8">
          <div className="icon-container">
            <div className="icon-area">
              <h2 className="login-title">MANAGE_SYSTEM</h2>
              <img src="/avatar.jpg" alt="Profile" />
            </div>
          </div>
          <div className="login-container">
          <div className="login-area">
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
              <button className="register-link">Register</button>
            </form>    
          </div>  
        </div>
      </div>

    );
};
export default Login;