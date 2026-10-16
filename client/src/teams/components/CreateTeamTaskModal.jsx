import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { createTeamTask } from "../api/teamApi";
import toast from "react-hot-toast";

export default function CreateTeamTaskModal({ teamId, members, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    assignedTo: ""
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createTeamTask(teamId, form);
      toast.success("Task created");
      onCreated();
      onClose();
    } catch {
      toast.error("Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="card max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto p-6 shadow-2xl shadow-black/50 sm:p-7"
      >
        <h2 className="text-xl font-semibold text-ink">Create Task</h2>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">Task name</span>
          <input
            type="text"
            placeholder="Task name"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">Description</span>
          <textarea
            placeholder="Description"
            rows={3}
            className="input resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">Assign to</span>
          <select
            className="input"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          >
            <option value="">Assign to...</option>
            {members.map((m) => (
              <option key={m.user._id} value={m.user._id}>
                {m.user.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button disabled={saving} className="btn-primary min-w-[120px]">
            {saving ? <ClipLoader color="#fff" size={16} /> : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
