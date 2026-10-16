import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FullPageLoader from "../components/FullPageLoader.jsx";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "admin") return <Navigate to="/dashboard" />;

  return children;
}
