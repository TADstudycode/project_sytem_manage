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
      <div className="container">
        <div className="row justify-content-center">
            <form onSubmit={handleSubmit}>
                <input type="email" className="username" placeholder="email" name="email" onChange={handleChange} required/>
                <input type="password" className="password" placeholder="Password" name="password" onChange={handleChange} required/>
                <button type="submit">Login</button>
            </form>
        </div>
      </div>  
    );
};
export default Login;