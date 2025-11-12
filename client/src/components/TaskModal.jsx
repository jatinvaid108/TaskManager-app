import { useState } from "react";

export default function TaskModal({ isOpen, onClose, onSave, existingTask }) {
  const [form, setForm] = useState(
    existingTask || { title: "", description: "", priority: "low", dueDate: "" }
  );

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96 space-y-3"
      >
        <h2 className="text-xl font-semibold text-center text-primary">
          {existingTask ? "Edit Task" : "Add New Task"}
        </h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Task Description"
          className="w-full border p-2 rounded"
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button type="submit" className="bg-primary text-white px-4 py-1 rounded hover:bg-indigo-600">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
