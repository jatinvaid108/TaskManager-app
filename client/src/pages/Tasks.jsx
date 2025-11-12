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
    const [activeFilter, setActiveFilter] = useState("all");

    // ---------------- Fetch All Tasks ----------------
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

    // ---------------- Fetch Tasks by Filter ----------------
    const fetchTasksBy = async (filterType, value) => {
        setLoading(true);
        try {
            const res = await api.get(`/todos?${filterType}=${value}`);
            setTasks(res.data.todos);
        } catch (err) {
            console.error("Error filtering tasks:", err);
            toast.error("Failed to filter tasks");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- Add or Update Task ----------------
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
            console.error("Error saving the task:", err);
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

    const handleToggleComplete = async (task) => {
        try {
            await api.put(`/todos/${task._id}`, { completed: !task.completed });
            toast.success(task.completed ? "Marked as pending" : "Marked as completed");
            fetchTasks();
        } catch {
            toast.error("Failed to update task status");
        }
    };
    const markAllCompleted = async () => {
        try {
            await api.put("/todos/mark-all-completed"); // backend route
            toast.success("All tasks marked as completed");
            fetchTasks(); // refresh list after marking
        } catch {
            toast.error("Failed to mark all completed");
        }
    };


    // ---------------- Initial Load ----------------
    useEffect(() => {
        fetchTasks();
    }, []);

    // ---------------- Render ----------------
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
                        onClick={() => { setModalOpen(true); setSelectedTask(null); }}
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-600"
                    >
                        + Add Task
                    </button>
                </div>
            </div>


            {/* ---------- 🔍 Filter Buttons ---------- */}
            <div className="flex flex-wrap gap-3 mb-4">
                <button
                    onClick={() => {
                        fetchTasks();
                        setActiveFilter("all");
                    }}
                    className={`px-3 py-1.5 rounded ${activeFilter === "all"
                        ? "bg-gray-300"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    All
                </button>

                <button
                    onClick={() => {
                        fetchTasksBy("completed", true);
                        setActiveFilter("completed");
                    }}
                    className={`px-3 py-1.5 rounded ${activeFilter === "completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                >
                    Completed
                </button>

                <button
                    onClick={() => {
                        fetchTasksBy("completed", false);
                        setActiveFilter("pending");
                    }}
                    className={`px-3 py-1.5 rounded ${activeFilter === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                >
                    Pending
                </button>

                <button
                    onClick={() => {
                        fetchTasksBy("priority", "high");
                        setActiveFilter("high");
                    }}
                    className={`px-3 py-1.5 rounded ${activeFilter === "high"
                        ? "bg-red-200 text-red-800"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                >
                    High Priority
                </button>
            </div>

            {/* ---------- Task List Section ---------- */}
            {loading ? (
                <div className="flex justify-center mt-10">
                    {/* Spinner centered */}
                    {/* <ClipLoader color="#6366F1" size={40} /> */}
                    <ClipLoader color="var(--color-primary)" size={40} />
                </div>
            ) : tasks.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                    No tasks found.
                </p>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={(t) => { setSelectedTask(t); setModalOpen(true); }}
                            onDelete={(id) => { setDeleteId(id); setConfirmOpen(true); }}
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
