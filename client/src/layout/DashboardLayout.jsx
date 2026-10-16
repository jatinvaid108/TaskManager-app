import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

export default function DashboardLayout({ children }) {
  // Mobile sidebar drawer (desktop sidebar is always visible)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close the drawer with the Escape key
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sidebarOpen]);

  return (
    <div className="theme-dark min-h-screen bg-night text-ink antialiased">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
