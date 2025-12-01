import { io } from "socket.io-client";

// Backend base URL
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "http://localhost:5000";

export const socket = io(BASE_URL, {
  withCredentials: true,
  autoConnect: false,
});
