import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../components/Logo.jsx";

// Shared shell for Landing, Login and Register: glow background, navbar, footer
export default function PublicLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="theme-dark relative flex min-h-screen flex-col overflow-hidden bg-night text-ink antialiased">

      {/* ================= BACKGROUND DECORATION ================= */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-glow-radial" />
        <div className="absolute left-1/2 top-[14%] h-[560px] w-[1200px] -translate-x-1/2 rounded-[50%] border border-brand/10" />
        <div className="absolute left-1/2 top-[22%] h-[400px] w-[860px] -translate-x-1/2 rounded-[50%] border border-brand/10" />
        <span className="absolute left-[8%] top-[35%] h-1 w-1 rounded-full bg-brand-light/60" />
        <span className="absolute left-[4%] top-[52%] h-1 w-1 rounded-full bg-brand-light/40" />
        <span className="absolute right-[16%] top-[36%] h-1 w-1 rounded-full bg-brand-light/60" />
        <span className="absolute right-[8%] top-[46%] h-1 w-1 rounded-full bg-brand-light/40" />
        <span className="absolute right-[15%] top-[58%] h-1 w-1 rounded-full bg-brand-light/50" />
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
        <Link to="/" aria-label="TaskManager Pro home">
          <Logo />
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link to="/login" className="font-medium text-ink-muted transition-colors hover:text-ink">
            Login
          </Link>
          <Link to="/register" className="btn-primary rounded-full px-6 shadow-glow-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="icon-btn sm:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="card absolute right-4 top-16 flex w-48 flex-col gap-2 p-3 shadow-2xl shadow-black/50 sm:hidden">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 font-medium text-ink-muted hover:bg-surface-hover hover:text-ink"
            >
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* ================= PAGE CONTENT ================= */}
      <main className="relative z-10 flex flex-1 flex-col">{children}</main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-line py-6 text-center text-sm text-ink-subtle">
        © {new Date().getFullYear()} TaskManager Pro — Built with ❤️ by Jatin
      </footer>
    </div>
  );
}
