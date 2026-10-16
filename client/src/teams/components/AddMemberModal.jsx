import { useState } from "react";
import { Search } from "lucide-react";
import { searchUsers, addMember } from "../api/teamApi";
import Avatar from "../../components/Avatar.jsx";
import toast from "react-hot-toast";

export default function AddMemberModal({ teamId, onClose, onAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.length < 2) return;
    const users = await searchUsers(val);
    setResults(users);
  };

  const handleAdd = async (userId) => {
    try {
      await addMember(teamId, userId);
      toast.success("Member added");
      onAdded();
      onClose();
    } catch {
      toast.error("Failed to add member");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card max-h-[90vh] w-full max-w-md overflow-y-auto p-6 shadow-2xl shadow-black/50 sm:p-7">

        <h2 className="text-xl font-semibold text-ink">Add Member</h2>
        <p className="mb-5 mt-1 text-sm text-ink-muted">Search by email, then select a user to add.</p>

        <label className="block">
          <span className="sr-only">Search email</span>
          <span className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
            />
            <input
              type="text"
              placeholder="Search email..."
              className="input pl-10"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
          </span>
        </label>
        <p className="mt-1.5 px-1 text-xs text-ink-subtle">Type at least 2 characters.</p>

        {results.length > 0 && (
          <div className="mt-3 max-h-52 overflow-y-auto rounded-xl border border-line bg-surface-raised p-1">
            {results.map((u) => (
              <button
                type="button"
                key={u._id}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-hover"
                onClick={() => handleAdd(u._id)}
              >
                <Avatar name={u.name} id={u._id} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{u.name}</span>
                  <span className="block truncate text-sm text-ink-muted">{u.email}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="btn-ghost mt-6 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
