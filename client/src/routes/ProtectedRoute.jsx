import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ClipLoader } from "react-spinners";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While checking session -> show loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#6366F1" size={40} />
      </div>
    );
  }

  // After loading -> if no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
