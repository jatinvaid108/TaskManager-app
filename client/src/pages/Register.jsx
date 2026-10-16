import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight, Lock, Mail, User, UserPlus } from "lucide-react";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ClipLoader } from "react-spinners";
import PublicLayout from "../layout/PublicLayout.jsx";
import AuthInput from "../components/AuthInput.jsx";

export default function Register() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      setUser(res.data.user);
      toast.success(`Account created. Welcome ${res.data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="card w-full max-w-md border-brand/40 bg-card-glow p-8 shadow-glow sm:p-10"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface-raised text-brand-light">
            <UserPlus size={28} />
          </div>
          <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">Create Account</h2>
          <p className="mt-2 text-center text-sm text-ink-muted">
            Join us and start managing your tasks.
          </p>

          <div className="mt-8 space-y-4">
            <AuthInput icon={User} name="name" placeholder="Name"
              autoComplete="name" onChange={handleChange} required />
            <AuthInput icon={Mail} name="email" type="email" placeholder="Email"
              autoComplete="email" onChange={handleChange} required />
            <div>
              <AuthInput icon={Lock} name="password" type="password" placeholder="Password"
                autoComplete="new-password" minLength={6} onChange={handleChange} required />
              <p className="mt-1.5 px-1 text-xs text-ink-subtle">At least 6 characters.</p>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary relative mt-6 w-full py-3 text-[15px]">
            {loading ? <ClipLoader color="#fff" size={20} /> : (
              <>
                Register
                <ArrowRight size={18} className="absolute right-4" />
              </>
            )}
          </button>

          <p className="mt-8 text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brand-light hover:text-ink">Login</Link>
          </p>
        </form>
      </div>
    </PublicLayout>
  );
}
