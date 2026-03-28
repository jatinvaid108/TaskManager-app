import { useState } from "react";
import { searchUsers, addMember } from "../api/teamApi";
import toast from "react-hot-toast";

export default function AddMemberModal({ teamId, onClose, onAdded, currentMembers = [] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [adding, setAdding] = useState(null); // userId being added

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.length < 2) return;
    const users = await searchUsers(val);
    // Filter out users who are already members
    const filteredUsers = users.filter(u => !currentMembers.some(m => m.user._id === u._id));
    setResults(filteredUsers);
  };

  const handleAdd = async (userId) => {
    if (adding) return; // Prevent multiple adds
    setAdding(userId);
    try {
      const response = await addMember(teamId, userId);
      toast.success("Member added successfully");
      onAdded(response); // Pass the updated team data
      onClose();
    } catch (error) {
      console.error("Add member error:", error);
      toast.error(error.response?.data?.message || "Failed to add member");
    } finally {
      setAdding(null);
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
          disabled={adding !== null}
        />

        <div className="max-h-40 overflow-y-auto border rounded mb-4">
          {results.map((u) => (
            <div
              key={u._id}
              className="p-2 flex justify-between items-center border-b last:border-b-0"
            >
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
              </div>
              <button
                onClick={() => handleAdd(u._id)}
                disabled={adding !== null}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  adding === u._id
                    ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                    : adding !== null
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {adding === u._id ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  'Add'
                )}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          disabled={adding !== null}
          className={`px-4 py-2 rounded w-full ${
            adding !== null
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
}
