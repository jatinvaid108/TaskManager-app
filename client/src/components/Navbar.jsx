import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, Menu } from "lucide-react";
import api from "../utils/api.js";
import NotificationBell from "./NotificationBell";


export default function Navbar({ onMenuClick }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
  <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-4 border-b border-line bg-night/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
    <div className="flex min-w-0 items-center gap-2">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="icon-btn lg:hidden"
      >
        <Menu size={22} />
      </button>

      <p className="truncate text-lg font-semibold text-ink sm:text-2xl">
        Hello, <span className="text-brand-light">{user?.name}</span> 👋
      </p>
    </div>

    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      {/* Notification Bell */}
      <NotificationBell />

      {/* User avatar (initial) */}
      <span
        title={user?.name}
        className="hidden h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white sm:flex"
      >
        {user?.name?.charAt(0).toUpperCase()}
      </span>

      {/* Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Logout"
        className="btn-ghost px-3 sm:px-4"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  </header>
);

}
