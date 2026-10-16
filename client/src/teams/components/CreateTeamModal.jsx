import { useState } from "react";
import { Search, X } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { createTeam, searchUsers } from "../api/teamApi";
import Avatar from "../../components/Avatar.jsx";
import toast from "react-hot-toast";

export default function CreateTeamModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.length < 2) return;

    const users = await searchUsers(value);
    setSearchResults(users);
  };

  const addMember = (user) => {
    if (!selectedMembers.some((m) => m._id === user._id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setQuery("");
    setSearchResults([]);
  };

  const removeMember = (id) => {
    setSelectedMembers(selectedMembers.filter((m) => m._id !== id));
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Team name required");
      return;
    }

    setSaving(true);
    try {
      await createTeam({
        name,
        description: desc,
        members: selectedMembers.map((u) => ({ userId: u._id })),
      });

      toast.success("Team created");
      onCreated();
      onClose();
    } catch {
      toast.error("Failed to create team");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card max-h-[90vh] w-full max-w-md overflow-y-auto p-6 shadow-2xl shadow-black/50 sm:p-7">

        <h2 className="mb-5 text-xl font-semibold text-ink">Create Team</h2>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Team name</span>
            <input
              className="input"
              placeholder="e.g. Frontend devs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">Description</span>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="What is this team working on?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </label>

          {/* Search Users */}
          <div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-muted">Add members</span>
              <span className="relative block">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
                />
                <input
                  className="input pl-10"
                  placeholder="Search users by email"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </span>
            </label>
            <p className="mt-1.5 px-1 text-xs text-ink-subtle">Type at least 2 characters.</p>

            {searchResults.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-line bg-surface-raised p-1">
                {searchResults.map((user) => (
                  <button
                    type="button"
                    key={user._id}
                    onClick={() => addMember(user)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-hover"
                  >
                    <Avatar name={user.name} id={user._id} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-ink">{user.name}</span>
                      <span className="block truncate text-xs text-ink-muted">{user.email}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 py-1 pl-1 pr-2 text-sm text-ink"
                >
                  <Avatar name={m.name} id={m._id} size="sm" className="h-6 w-6" />
                  {m.name}
                  <button
                    type="button"
                    onClick={() => removeMember(m._id)}
                    aria-label={`Remove ${m.name}`}
                    className="rounded-full p-0.5 text-ink-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="btn-primary min-w-[96px]"
          >
            {saving ? <ClipLoader color="#fff" size={16} /> : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
