import axios from "axios";

const api = axios.create({
  baseURL: "https://stayease-backend-4u9f.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("stayease_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;