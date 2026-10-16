import DashboardLayout from "../layout/DashboardLayout.jsx";
import api, { TASK_LIMIT } from "../utils/api.js";
import ConfirmModal from "../components/ConfirmModal.jsx";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { CalendarDays, RotateCcw, SquareCheckBig, Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { formatDate, formatTime } from "../utils/formatDate.js";

export default function Trash() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null); // task waiting for permanent-delete confirmation

  // ---------------- Fetch Deleted Tasks ----------------
  const fetchTrash = async () => {
    setLoading(true);
    try {
      const res = await api.get("/todos?deleted=true", { params: { limit: TASK_LIMIT } });
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
      await api.delete(`/todos/${id}/permanent`);
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

  const restoreButton =
    "btn-ghost border-green-500/30 text-green-400 hover:border-green-500/50 hover:bg-green-500/10";
  const deleteButton =
    "btn-ghost border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10";

  return (
    <DashboardLayout>
      {/* ---------- Header ---------- */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Trash Bin</h1>
          <p className="mt-1 text-ink-muted">
            Deleted tasks are moved here. You can restore or permanently delete them.
          </p>
        </div>
        {(tasks || []).length > 0 && (
          <button onClick={handleRestoreAll} className={`${restoreButton} shrink-0`}>
            <RotateCcw size={18} /> Restore All
          </button>
        )}
      </div>

      {/* ---------- Summary ---------- */}
      <div className="card mb-6 flex items-center gap-5 p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-light ring-1 ring-brand/30">
          <Trash2 size={28} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-muted">Total Deleted Tasks</p>
          <p className="mt-1 text-3xl font-bold text-ink">{loading ? "–" : (tasks || []).length}</p>
          <p className="mt-1 text-sm text-ink-subtle">Tasks in trash</p>
        </div>
      </div>

      {/* ---------- Task List Section ---------- */}
      <div className="card p-3 sm:p-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <ClipLoader color="#A78BFA" size={40} />
          </div>
        ) : (tasks || []).length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-subtle">No deleted tasks.</p>
        ) : (
          <>
            {/* Column headings (wide screens only) */}
            <div className="hidden px-4 pb-3 pt-1 text-sm font-medium text-ink-muted xl:grid xl:grid-cols-[minmax(0,1fr)_200px_330px] xl:gap-6">
              <span>Task</span>
              <span>Deleted On</span>
              <span>Actions</span>
            </div>

            <div className="space-y-3">
              {(tasks || []).map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col gap-4 rounded-xl border border-line bg-surface-raised p-4 transition-colors hover:border-line-strong xl:grid xl:grid-cols-[minmax(0,1fr)_200px_330px] xl:items-center xl:gap-6"
                >
                  {/* Task info */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-light">
                      <SquareCheckBig size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-ink">{task.title}</h3>
                      {task.description && (
                        <p className="truncate text-sm text-ink-muted">{task.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Deleted on (last update = the soft delete) */}
                  <div className="flex items-start gap-2 text-sm">
                    <CalendarDays size={16} className="mt-0.5 shrink-0 text-ink-subtle" />
                    <div>
                      <p className="text-ink">{formatDate(task.updatedAt)}</p>
                      <p className="text-xs text-ink-subtle">{formatTime(task.updatedAt)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleRestore(task._id)} className={restoreButton}>
                      <RotateCcw size={16} /> Restore
                    </button>

                    <button onClick={() => setConfirmId(task._id)} className={deleteButton}>
                      <Trash2 size={16} /> Delete Permanently
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => {
          handlePermanentDelete(confirmId);
          setConfirmId(null);
        }}
        title="Delete permanently?"
        message="This task will be deleted forever. This can’t be undone."
        confirmLabel="Delete Permanently"
      />
    </DashboardLayout>
  );
}
