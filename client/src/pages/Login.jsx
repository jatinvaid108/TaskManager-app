import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";


export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      setUser(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-80 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-primary">Login</h2>
        <input name="email" type="email" placeholder="Email"
          className="w-full border p-2 rounded" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password"
          className="w-full border p-2 rounded" onChange={handleChange} required />
        <button type="submit" disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-indigo-600">
          {loading ? <ClipLoader color="#fff" size={20} /> : "Login"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Don’t have an account? <Link to="/register" className="text-primary">Register</Link>
        </p>
      </form>
    </div>
  );
}
