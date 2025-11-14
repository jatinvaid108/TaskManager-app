import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, ListTodo, BarChart2 } from "lucide-react";

export default function Sidebar() {
  const linkClasses =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-gray-700 transition";

  const activeClasses = "bg-gray-700";

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ""}`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ""}`
          }
        >
          <Users size={20} />
          Users
        </NavLink>

        <NavLink
          to="/admin/tasks"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ""}`
          }
        >
          <ListTodo size={20} />
          Tasks
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ""}`
          }
        >
          <BarChart2 size={20} />
          Analytics
        </NavLink>
      </nav>
    </aside>
  );
}
