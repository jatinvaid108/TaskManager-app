import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api",  // local fallback
  withCredentials: true,
});

// The tasks API returns 10 items per page by default; ask for all of them
export const TASK_LIMIT = 1000;

export default api;
