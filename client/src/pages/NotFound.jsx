import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PublicLayout from "../layout/PublicLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function NotFound() {
  const { user } = useAuth();

  return (
    <PublicLayout>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">Page not found</h1>
        <p className="mt-2 max-w-md text-ink-muted">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to={user ? "/dashboard" : "/"} className="btn-primary mt-8 px-6 py-3">
          <ArrowLeft size={18} />
          {user ? "Back to Dashboard" : "Back to Home"}
        </Link>
      </div>
    </PublicLayout>
  );
}
