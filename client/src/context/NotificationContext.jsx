/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notificationApi";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";
import { socket } from "../utils/socket"; // <= make sure this exists
const NotificationContext = createContext();

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
    : "http://localhost:5000");

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const notes = await getNotifications();
      setNotifications(notes);
      setUnreadCount(notes.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Notification Load Error:", err);
    }
  };

  // Initial load from backend
  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  // 🔴 Real-time socket connection
  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    // join user-specific room
    const userId = user.id || user._id;
    if (userId) {
      socket.emit("join", userId);
    }

    socket.on("notification:new", (note) => {
      // prepend new notification
      setNotifications((prev) => [note, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markRead = async (id) => {
    await markNotificationRead(id);
    await loadNotifications();
  };

  const markAllRead = async () => {
    await markAllNotificationsRead();
    await loadNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loadNotifications,
        markRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
