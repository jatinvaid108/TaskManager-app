import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // ---------------- Fetch All Tasks ----------------
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/todos");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching todos:", err);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Filter Tasks ----------------
  const fetchTasksBy = async (filter) => {
    setLoading(true);
    try {
      let url = "/todos";

      if (filter === "completed") url = "/todos?completed=true";
      else if (filter === "pending") url = "/todos?completed=false";
      else if (filter === "high") url = "/todos?priority=high";

      const res = await api.get(url);
      setTasks(res.data.tasks || []);
    } catch {
      toast.error("Failed to apply filter");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Add or Update Task ----------------
  const handleSave = async (form) => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: form.dueDate,
      };

      if (selectedTask) {
        await api.put(`/todos/${selectedTask._id}`, payload);
        toast.success("Task updated");
      } else {
        await api.post("/todos", payload);
        toast.success("Task added");
      }

      fetchTasks();
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving task:", err);
      toast.error("Error saving task");
    }
  };

  // ---------------- Delete Task ----------------
  const handleDelete = async () => {
    try {
      await api.delete(`/todos/${deleteId}`);
      toast.success("Task moved to Trash");
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    } finally {
      setConfirmOpen(false);
    }
  };

  // ---------------- Toggle Complete (Optimistic UI) ----------------
  const handleToggleComplete = async (task) => {
    const updated = !task.completed;

    // 1️⃣ Instant UI update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, completed: updated } : t
      )
    );

    try {
      // 2️⃣ API update
      await api.put(`/todos/${task._id}`, { completed: updated });
      toast.success(updated ? "Task completed!" : "Marked as pending");
    } catch (err) {
      toast.error("Failed to update status");

      // 3️⃣ Revert UI if failed
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, completed: task.completed } : t
        )
      );
    }
  };

  // ---------------- Mark All Completed ----------------
  const markAllCompleted = async () => {
    try {
      // 1️⃣ Optimistic update
      setTasks((prev) => prev.map((t) => ({ ...t, completed: true })));

      // 2️⃣ API update
      await api.put("/todos/mark-all-completed");

      toast.success("All tasks marked as completed");
    } catch {
      toast.error("Failed to mark all as completed");
      fetchTasks(); // fallback restore
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <DashboardLayout>
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Tasks</h1>
        <div className="flex gap-3">
          <button
            onClick={markAllCompleted}
            className="border border-primary text-primary px-3 py-2 rounded-lg hover:bg-indigo-50"
          >
            Mark All Completed
          </button>

          <button
            onClick={() => {
              setModalOpen(true);
              setSelectedTask(null);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-600"
          >
            <PlusCircle size={18} /> Add Task
          </button>
        </div>
      </div>

      {/* ---------- Filters ---------- */}
      <div className="mb-4 flex items-center gap-3">
        <select
          onChange={(e) => fetchTasksBy(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-primary"
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      {/* ---------- Task List ---------- */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <ClipLoader color="#6366F1" size={40} />
        </div>
      ) : (tasks || []).length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No tasks found.</p>
      ) : (
        <div className="space-y-3">
          {(tasks || []).map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(t) => {
                setSelectedTask(t);
                setModalOpen(true);
              }}
              onDelete={(id) => {
                setDeleteId(id);
                setConfirmOpen(true);
              }}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}

      {/* ---------- Modals ---------- */}
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
