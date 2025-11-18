import { useState } from "react";
import { createTeamTask } from "../api/teamApi";
import toast from "react-hot-toast";

export default function CreateTeamTaskModal({ teamId, members, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    assignedTo: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeamTask(teamId, form);
      toast.success("Task created");
      onCreated();
      onClose();
    } catch {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>

        <input
          type="text"
          placeholder="Task name"
          className="border p-2 w-full rounded mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full rounded mb-3"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="border p-2 w-full rounded mb-3"
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

        <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
          Create Task
        </button>

        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded w-full mt-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
