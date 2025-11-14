import { useAuth } from "../../context/AuthContext";

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="text-gray-600">
        Hi, <span className="font-medium">{user?.name}</span>
      </div>
    </header>
  );
}
