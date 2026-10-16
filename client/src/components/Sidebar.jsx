import { NavLink } from "react-router-dom";
import { House, SquareCheckBig, Users, Trash2, X } from "lucide-react";
import Logo from "./Logo.jsx";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: House },
  { name: "Tasks", path: "/tasks", icon: SquareCheckBig },
  { name: "Teams", path: "/teams", icon: Users },
  { name: "Trash", path: "/trash", icon: Trash2 },
];

export default function Sidebar({ isOpen = false, onClose }) {
  return (
    <>
      {/* ---------- Mobile backdrop ---------- */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* ---------- Sidebar (fixed on desktop, drawer on mobile) ---------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col lg:w-64 border-r border-line bg-night-light px-4 py-6 transition-[transform,visibility] duration-300 lg:visible lg:translate-x-0 ${
          isOpen ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center justify-between px-2">
          <Logo />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="icon-btn h-9 w-9 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex h-12 items-center gap-3 rounded-xl border px-4 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light/40 ${
                  isActive
                    ? "border-brand/30 bg-brand/15 text-brand-light"
                    : "border-transparent text-ink-muted hover:bg-surface-hover hover:text-ink"
                }`
              }
            >
              <Icon size={20} />
              {link.name}
            </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
