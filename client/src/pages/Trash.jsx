import DashboardLayout from "../layout/DashboardLayout.jsx";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function Trash() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- Fetch Deleted Tasks ----------------
  const fetchTrash = async () => {
    setLoading(true);
    try {
      const res = await api.get("/todos?deleted=true");
      setTasks(res.data.tasks || []); // safe
    } catch (err) {
      console.error("Failed to load trash:", err);
      toast.error("Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Restore Single Task ----------------
  const handleRestore = async (id) => {
    try {
      await api.put(`/todos/restore/${id}`);
      toast.success("Task restored");
      fetchTrash();
    } catch {
      toast.error("Failed to restore");
    }
  };

  // ---------------- Restore All Tasks ----------------
  const handleRestoreAll = async () => {
    try {
      await api.put("/todos/restore-all");
      toast.success("All tasks restored");
      fetchTrash();
    } catch {
      toast.error("Failed to restore tasks");
    }
  };

  // ---------------- Permanent Delete ----------------
  const handlePermanentDelete = async (id) => {
    try {
      await api.delete(`/admin/tasks/${id}`);
      toast.success("Task permanently deleted");
      fetchTrash();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ---------------- Initial Load ----------------
  useEffect(() => {
    fetchTrash();
  }, []);

  return (
    <DashboardLayout>
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Trash Bin</h1>
        {(tasks || []).length > 0 && (
          <button
            onClick={handleRestoreAll}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Restore All
          </button>
        )}
      </div>

      {/* ---------- Task List Section ---------- */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <ClipLoader color="#6366F1" size={40} />
        </div>
      ) : (tasks || []).length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No deleted tasks.</p>
      ) : (
        <div className="space-y-3">
          {(tasks || []).map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-500">{task.description}</p>
                )}
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
