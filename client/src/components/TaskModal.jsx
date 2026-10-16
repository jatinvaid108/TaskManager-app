import { useState } from "react";

export default function TaskModal({ isOpen, onClose, onSave, existingTask }) {
  const [form, setForm] = useState(() =>
    existingTask
      ? {
          ...existingTask,
          description: existingTask.description || "",
          // date inputs need "YYYY-MM-DD", the API sends a full ISO date
          dueDate: existingTask.dueDate ? existingTask.dueDate.slice(0, 10) : "",
        }
      : { title: "", description: "", priority: "low", dueDate: "" }
  );

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md space-y-4 p-6 shadow-2xl shadow-black/50 sm:p-7"
      >
        <h2 className="text-xl font-semibold text-ink">
          {existingTask ? "Edit Task" : "Add New Task"}
        </h2>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="input"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Task Description"
            rows={3}
            className="input resize-none"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Priority</span>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Due Date</span>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="input"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary px-6">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
