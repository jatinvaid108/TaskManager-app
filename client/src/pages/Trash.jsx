import DashboardLayout from "../layout/DashboardLayout.jsx";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";

export default function Trash() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const res = await api.get("/todos?deleted=true");
      setTasks(res.data.todos);
    } catch {
      toast.error("Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.put(`/todos/restore/${id}`);
      toast.success("Task restored");
      fetchTrash();
    } catch {
      toast.error("Failed to restore");
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await api.delete(`/admin/tasks/${id}`);
      toast.success("Task permanently deleted");
      fetchTrash();
    } catch {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Trash Bin</h1>
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No deleted tasks.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleRestore(task._id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={() => handlePermanentDelete(task._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
