import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { StatusBadge, PriorityLabel } from "./TaskBadges.jsx";
import { formatDate } from "../utils/formatDate.js";

export default function RecentTasks({ tasks, className = "" }) {
  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-lg font-semibold text-ink">Recent Tasks</h2>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-brand-light transition-colors hover:bg-surface-hover"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="px-6 pb-10 pt-4 text-center text-sm text-ink-subtle">
          No tasks yet. Create your first task from the Tasks page.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] whitespace-nowrap text-left text-sm">
            <thead className="border-y border-line bg-surface-raised/50 text-ink-muted">
              <tr>
                <th className="px-6 py-3 font-medium">Task Name</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Due Date</th>
                <th className="px-6 py-3 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tasks.map((task) => (
                <tr key={task._id} className="transition-colors hover:bg-surface-hover/50">
                  <td className="max-w-[260px] truncate px-6 py-4 font-medium text-ink">{task.title}</td>
                  <td className="px-6 py-4"><StatusBadge completed={task.completed} withDot /></td>
                  <td className="px-6 py-4"><PriorityLabel priority={task.priority} /></td>
                  <td className="px-6 py-4 text-ink-muted">{formatDate(task.dueDate)}</td>
                  <td className="px-6 py-4 text-ink-muted">{formatDate(task.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
