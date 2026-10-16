/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api.js";
import { socket } from "../utils/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user immediately from localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/auth/getMe");
        const me = res.data.user;
        // Keep the same shape as login/register ({ id, ... }) — the app compares user.id
        const normalized = { id: me._id, name: me.name, email: me.email, role: me.role };
        setUser(normalized);
        localStorage.setItem("user", JSON.stringify(normalized));
      } catch (err) {
        // Session expired or cookie missing → log out locally.
        // Network/server errors keep the saved user (offline-friendly).
        if (err.response?.status === 401) setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // keep syncing user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);
  useEffect(() => {
  if (user) {
    socket.auth = { userId: user.id };
    socket.connect();
  }
}, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
