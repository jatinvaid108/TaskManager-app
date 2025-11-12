import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Trash2, Users } from "lucide-react";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare size={20} /> },
    { name: "Trash", path: "/trash", icon: <Trash2 size={20} /> },
    { name: "Team", path: "/team", icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-60 bg-white shadow-md h-screen fixed top-0 left-0 p-5 flex flex-col">
      <h2 className="text-xl font-bold text-primary mb-8">TaskManager</h2>
      <nav className="space-y-3">
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition-all ${
                isActive ? "bg-indigo-100 text-primary" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
