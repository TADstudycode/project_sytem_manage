import axios from 'axios';
import { useNavigate } from "react-router-dom";
const BASE_URL = "http://127.0.0.1:8000/api";
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getCsrfToken = async () => {
  try {
        await axios.get(`http://127.0.0.1:8000/sanctum/csrf-cookie`, { withCredentials: true });
    } catch (error) {
        console.error(error);
    }
};

const logout = async () =>{
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    return null;
  }
}

export const fetchData = async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      return null;
    }
  };

export default api;