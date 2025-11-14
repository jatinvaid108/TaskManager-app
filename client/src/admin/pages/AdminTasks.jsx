import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllTasksAdmin, hardDeleteTask } from "../api/adminApi";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getAllTasksAdmin();
      setTasks(data.tasks || []);
    } catch (err) {
      toast.error("Failed to load tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hard delete this task permanently?")) return;

    try {
      await hardDeleteTask(id);
      toast.success("Task deleted");
      loadTasks(); // refresh list
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-6">Tasks Management</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
          
          <h3 className="text-lg font-medium mb-4">
            Total Tasks: {tasks.length}
          </h3>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Title</th>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b">Priority</th>
                <th className="p-3 border-b">Completed</th>
                <th className="p-3 border-b">Deleted</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{task.title}</td>
                  <td className="p-3 text-blue-600">{task.user?.name}</td>
                  <td className="p-3 capitalize">{task.priority}</td>
                  <td className="p-3">
                    {task.completed ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="p-3">
                    {task.deleted ? (
                      <span className="text-red-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(task._id)}
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
      )}
    </AdminLayout>
  );
}
