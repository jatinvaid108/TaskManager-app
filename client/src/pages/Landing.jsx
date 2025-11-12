/* eslint-disable no-unused-vars */

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import logo from "../assets/logo.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-primary">TaskManager Pro</h1>
        </div>
        <div className="space-x-5">
          <a href="/login" className="text-gray-600 hover:text-primary font-medium">Login</a>
          <a href="/register" className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition-all">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        className="flex flex-col items-center justify-center flex-1 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl md:text-6xl font-extrabold text-dark mb-4 leading-tight">
          Organize your <span className="text-primary">Tasks</span> Smartly.
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mb-8">
          Boost productivity with your personal task manager. Plan, track, and
          achieve your goals seamlessly — anytime, anywhere.
        </p>
        <a
          href="/register"
          className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-600 transition-all"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </a>
      </motion.div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} TaskManager Pro — Built with ❤️ by Jatin
      </footer>
    </div>
  );
}
