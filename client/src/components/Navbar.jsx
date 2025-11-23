import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api.js";
import NotificationBell from "./NotificationBell";


export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
  <header className="flex items-center justify-between bg-white shadow px-6 py-3 sticky top-0 z-10">
    <h1 className="text-lg font-semibold text-gray-800">
      Hello, <span className="text-primary font-bold">{user?.name}</span> 👋
    </h1>

    <div className="flex items-center gap-6">
      {/* Notification Bell */}
      <NotificationBell />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-indigo-600 transition-all"
      >
        Logout
      </button>
    </div>
  </header>
);

}
