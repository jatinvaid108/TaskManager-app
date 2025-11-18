import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeamById, removeMember, leaveTeam } from "../api/teamApi";
import AddMemberModal from "../components/AddMemberModal";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function TeamPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();

  const loadTeam = async () => {
    try {
      const data = await getTeamById(teamId);
      setTeam(data.team);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load team");
    }
  };

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  if (!team)
    return <div className="p-6 text-center">Loading Team...</div>;

  const isOwner = team.members.some(m => m.user._id === user.id && m.role === "owner");
  const isAdmin = team.members.some(m => m.user._id === user.id && (m.role === "admin" || m.role === "owner"));

  const handleRemove = async (memberId) => {
    try {
      await removeMember(teamId, memberId);
      toast.success("Member removed");
      loadTeam();
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const handleLeave = async () => {
    try {
      await leaveTeam(teamId);
      toast.success("Left team");
      window.location.href = "/teams";
    } catch {
      toast.error("Failed to leave team");
    }
  };

  return (
    <>
      {showAddModal && (
        <AddMemberModal
          teamId={teamId}
          onClose={() => setShowAddModal(false)}
          onAdded={loadTeam}
        />
      )}

      <div className="p-6 max-w-2xl mx-auto">

        <h2 className="text-2xl font-semibold mb-2">{team.name}</h2>
        <p className="text-gray-600 mb-4">{team.description}</p>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Members</h3>

          {(isOwner || isAdmin) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
              + Add Member
            </button>
          )}
        </div>

        <div className="space-y-3">
          {team.members.map((m) => (
            <div
              key={m.user._id}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{m.user.name}</p>
                <p className="text-sm text-gray-600">{m.user.email}</p>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {m.role}
                </span>
              </div>

              {/* Remove button only for owner/admin */}
              {(isOwner || isAdmin) && m.role !== "owner" && (
                <button
                  onClick={() => handleRemove(m.user._id)}
                  className="text-red-600 font-semibold"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Leave team (only if not owner) */}
        {!isOwner && (
          <button
            onClick={handleLeave}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded"
          >
            Leave Team
          </button>
        )}
      </div>
    </>
  );
}
