import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import FullPageLoader from "../components/FullPageLoader.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While checking session -> show loader
  if (loading) {
    return <FullPageLoader />;
  }

  // After loading -> if no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
