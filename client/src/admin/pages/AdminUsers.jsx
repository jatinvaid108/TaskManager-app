import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllUsers, deleteUserById } from "../api/adminApi";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users on page load
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users || []);
    } catch (err) {
      toast.error("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUserById(id);
      toast.success("User deleted");
      loadUsers(); // refresh list
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-6">Users Management</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-medium mb-4">
            Total Users: {users.length}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
