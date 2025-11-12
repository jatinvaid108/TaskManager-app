import DashboardLayout from "../layout/DashboardLayout.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/todos");
      setTasks(res.data.todos);
    } catch (err) {
      console.error("Error fetching todos:", err);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    try {
      if (selectedTask) {
        await api.put(`/todos/${selectedTask._id}`, form);
        toast.success("Task updated");
      } else {
        await api.post("/todos", form);
        toast.success("Task added");
      }
      fetchTasks();
      setModalOpen(false);
    } catch (err) {
      console.error("Error in saving the task:",err);
      toast.error("Error saving task");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/todos/${deleteId}`);
      toast.success("Task moved to Trash");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Tasks</h1>
        <button
          onClick={() => { setModalOpen(true); setSelectedTask(null); }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-600"
        >
          <PlusCircle size={18} /> Add Task
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(t) => { setSelectedTask(t); setModalOpen(true); }}
              onDelete={(id) => { setDeleteId(id); setConfirmOpen(true); }}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        existingTask={selectedTask}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
