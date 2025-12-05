import { Edit2, Trash2, CheckCircle2, Circle } from "lucide-react";

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex justify-between items-center">
      
      {/* ---------- Left Section (Tick + Task Info) ---------- */}
      <div className="flex items-start gap-3">
        
        {/* Toggle Complete Button */}
        <button onClick={() => onToggleComplete(task)} className="mt-1">
          {task.completed ? (
            <CheckCircle2 className="text-green-500" size={22} />
          ) : (
            <Circle className="text-gray-400 hover:text-green-500" size={22} />
          )}
        </button>

        {/* Task Content */}
        <div>
          <h3
            className={`text-lg font-semibold ${
              task.completed ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-gray-500 text-sm">{task.description}</p>
          )}

          <p className="text-xs text-gray-400 mt-1">
            Priority:{" "}
            <span
              className={
                task.priority === "high"
                  ? "text-red-500 font-medium"
                  : task.priority === "low"
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {task.priority || "normal"}
            </span>
          </p>

          {/* Optional Due Date */}
          {task.dueDate && (
            <p className="text-xs text-indigo-500 mt-1">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* ---------- Right Section (Edit + Delete) ---------- */}
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Edit2 size={18} />
        </button>

        <button
          onClick={() => onDelete(task._id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
