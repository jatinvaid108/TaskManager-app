import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://taskmanager-app-ae03.onrender.com/api",
  withCredentials: true, // important for sending JWT cookie
});

export default api;
