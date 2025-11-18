import { useState } from "react";
import { searchUsers, addMember } from "../api/teamApi";
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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">

        <h2 className="text-xl font-semibold mb-4">Add Member</h2>

        <input
          type="text"
          placeholder="Search email..."
          className="border p-2 w-full rounded mb-3"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="max-h-40 overflow-y-auto border rounded mb-4">
          {results.map((u) => (
            <div
              key={u._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleAdd(u._id)}
            >
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
