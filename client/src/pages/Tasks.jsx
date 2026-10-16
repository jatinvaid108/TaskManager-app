import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import api, { TASK_LIMIT } from "../utils/api.js";
import toast from "react-hot-toast";
import { CircleCheck, ClipboardList, Plus } from "lucide-react";
import { ClipLoader } from "react-spinners";

const filters = [
  { value: "all", label: "All Tasks" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "high", label: "High Priority" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // ---------------- Fetch All Tasks ----------------
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/todos", { params: { limit: TASK_LIMIT } });
      setTasks(res.data.tasks || []);
      setActiveFilter("all"); // list now shows all tasks, keep the tab in sync
    } catch (err) {
      console.error("Error fetching todos:", err);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Filter Tasks ----------------
  const fetchTasksBy = async (filter) => {
    setActiveFilter(filter);
    setLoading(true);
    try {
      let url = "/todos";

      if (filter === "completed") url = "/todos?status=done";
      else if (filter === "pending") url = "/todos?status=pending";
      else if (filter === "high") url = "/todos?priority=high";

      const res = await api.get(url, { params: { limit: TASK_LIMIT } });
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
    const isDone = task.status?.toLowerCase() === "done" || task.completed;
    const updatedStatus = isDone ? "todo" : "done";

    // 1️⃣ Instant UI update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, status: updatedStatus } : t
      )
    );

    try {
      // 2️⃣ API update
      await api.put(`/todos/${task._id}`, { completed: updated });
      toast.success(updated ? "Task completed!" : "Marked as pending");
    } catch {
      toast.error("Failed to update status");

      // 3️⃣ Revert UI if failed
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, status: task.status } : t
        )
      );
    }
  };

  // ---------------- Mark All Completed ----------------
  const markAllCompleted = async () => {
    try {
      // 1️⃣ Optimistic update
      setTasks((prev) => prev.map((t) => ({ ...t, status: "done" })));

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-ink">My Tasks</h1>
        <p className="mt-1 text-ink-muted">Manage and organize your tasks efficiently.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* ---------- Filters ---------- */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => fetchTasksBy(filter.value)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light/40 ${
                  isActive
                    ? "border-brand/40 bg-brand/20 text-ink"
                    : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink"
                }`}
              >
                {filter.label}
                {isActive && !loading && (
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-xs">
                    {(tasks || []).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={markAllCompleted} className="btn-ghost">
            <CircleCheck size={18} /> Mark All Completed
          </button>

          <button
            onClick={() => {
              setModalOpen(true);
              setSelectedTask(null);
            }}
            className="btn-primary"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      {/* ---------- Task List ---------- */}
      {loading ? (
        <div className="flex justify-center mt-16">
          <ClipLoader color="#A78BFA" size={40} />
        </div>
      ) : (tasks || []).length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <div className="icon-tile mb-4 h-14 w-14 text-brand-light">
            <ClipboardList size={26} />
          </div>
          <p className="font-medium text-ink">No tasks found.</p>
          <p className="mt-1 text-sm text-ink-subtle">Try another filter or add a new task.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
      {/* Mounted only while open, so the form always starts from the selected task */}
      {modalOpen && (
        <TaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          existingTask={selectedTask}
        />
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
