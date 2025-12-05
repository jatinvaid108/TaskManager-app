/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ArrowRight, Menu } from "lucide-react";
import logo from "../assets/logo.png";
import { useState } from "react";

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 flex flex-col">

      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 relative">
        
        {/* Left: Logo + Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h1 className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
            TaskManager <span className="text-indigo-500">Pro</span>
          </h1>
        </div>

        {/* Desktop Buttons */}
        <div className="space-x-5 hidden sm:flex">
          <a href="/login" className="text-gray-600 hover:text-primary font-medium">
            Login
          </a>
          <a
            href="/register"
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition-all"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={26} />
        </button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-16 right-6 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-3 sm:hidden z-50">
            <a href="/login" className="text-gray-700 hover:text-primary font-medium">
              Login
            </a>
            <a
              href="/register"
              className="bg-primary text-white px-4 py-2 rounded-lg text-center hover:bg-indigo-600 transition-all"
            >
              Get Started
            </a>
          </div>
        )}
      </nav>

      {/* ================= HERO SECTION ================= */}
      <motion.div
        className="flex flex-col items-center justify-center flex-1 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark mb-4 leading-tight">
          Organize your <span className="text-primary">Tasks</span> Smartly.
        </h2>

        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mb-8">
          Boost productivity with your personal task manager. Plan, track,
          and achieve your goals seamlessly — anytime, anywhere.
        </p>

        <a
          href="/register"
          className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-600 transition-all"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </a>
      </motion.div>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} TaskManager Pro — Built with ❤️ by Jatin
      </footer>
    </div>
  );
}
