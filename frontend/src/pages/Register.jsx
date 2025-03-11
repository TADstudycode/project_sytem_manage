import {useState} from "react";
import api from "../api";
const Register = () => {
    const[formData, setFormData] = useState({
        name:"",
        email:"",
        password:"",
        password_confirmation:""
    });
    const handleChange = (e) =>{
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const response = await api.post("/account/register", formData);
            alert(response.data.message);
        } catch (error) {
            alert("lỗi khi đăng kí");
        }
    };
    return(
        <div className="container">
            <h2>Đăng Ký</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Họ tên" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
                <input type="password" name="password_confirmation" placeholder="Nhập lại mật khẩu" onChange={handleChange} required />
                <button type="submit">Đăng Ký</button>
            </form>
        </div>
    );
};
export default Register;