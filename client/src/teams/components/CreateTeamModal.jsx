import { useState } from "react";
import { createTeam, searchUsers } from "../api/teamApi";
import toast from "react-hot-toast";

export default function CreateTeamModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

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

    try {
      await createTeam({
        name,
        description: desc,
        members: selectedMembers.map((u) => ({ userId: u._id })),
      });

      toast.success("Team created");
      onCreated();
      onClose();
    } catch (err) {
      toast.error("Failed to create team");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">

        <h2 className="text-xl font-semibold mb-4">Create Team</h2>

        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded mb-2"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* Search Users */}
        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="Search users by email"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {searchResults.length > 0 && (
          <div className="border rounded mb-2 p-2 max-h-40 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => addMember(user)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {user.name} — {user.email}
              </div>
            ))}
          </div>
        )}

        {/* Selected Members */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedMembers.map((m) => (
            <div
              key={m._id}
              className="bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {m.name}
              <button
                onClick={() => removeMember(m._id)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
