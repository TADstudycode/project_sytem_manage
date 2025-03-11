import axios from 'axios';
const BASE_URL = "http://127.0.0.1:8000/api";
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});
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