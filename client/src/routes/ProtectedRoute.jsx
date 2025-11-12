import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ClipLoader } from "react-spinners";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#6366F1" size={40} />
      </div>
    );

  return user ? children : <Navigate to="/login" />;
}
