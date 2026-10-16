import { Check, Pencil, Trash2 } from "lucide-react";
import { StatusBadge, PriorityBadge } from "./TaskBadges.jsx";
import { formatDate } from "../utils/formatDate.js";

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  return (
    <div
      className={`card flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong ${
        task.completed ? "border-brand/30 bg-card-glow" : ""
      }`}
    >
      {/* ---------- Top Row (Tick + Status) ---------- */}
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => onToggleComplete(task)}
          aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light/50"
        >
          {task.completed ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
              <Check size={16} strokeWidth={3} />
            </span>
          ) : (
            <span className="block h-7 w-7 rounded-full border-2 border-amber-500 transition-colors hover:bg-amber-500/15" />
          )}
        </button>

        <StatusBadge completed={task.completed} />
      </div>

      {/* ---------- Task Content ---------- */}
      <h3
        className={`mt-4 break-words text-lg font-semibold ${
          task.completed ? "text-ink-subtle line-through" : "text-ink"
        }`}
      >
        {task.title}
      </h3>

      {task.description && (
        <p className="mt-1 line-clamp-3 break-words text-sm text-ink-muted">{task.description}</p>
      )}

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-center gap-3">
          <dt className="text-ink-subtle">Priority</dt>
          <dd><PriorityBadge priority={task.priority} /></dd>
        </div>
        <div className="flex items-center gap-3">
          <dt className="text-ink-subtle">Due Date</dt>
          <dd className={task.dueDate ? "text-brand-light" : "text-ink-subtle"}>
            {formatDate(task.dueDate)}
          </dd>
        </div>
      </dl>

      {/* ---------- Actions (Edit + Delete) ---------- */}
      <div className="mt-auto pt-5">
        <div className="flex justify-end gap-1 border-t border-line pt-3">
          <button
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="icon-btn h-9 w-9 text-brand-light hover:text-brand-light"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(task._id)}
            aria-label="Delete task"
            className="icon-btn h-9 w-9 text-red-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
