import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getTeamById,
  removeMember,
  leaveTeam,
  getTeamTasks,
  createTeamTask,
  updateTeamTask,
  deleteTeamTask
} from "../api/teamApi";

import AddMemberModal from "../components/AddMemberModal";
import CreateTeamTaskModal from "../components/CreateTeamTaskModal";

import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function TeamPage() {
  const { teamId } = useParams();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  // ---------------- Load Team + Tasks ----------------
  const loadTeam = async () => {
    try {
      const data = await getTeamById(teamId);
      setTeam(data.team);

      const taskList = await getTeamTasks(teamId);
      setTasks(taskList);
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

  // ---------------- Permissions ----------------
  const isOwner = team.members.some(
    (m) => m.user._id === user.id && m.role === "owner"
  );

  const isAdmin = team.members.some(
    (m) =>
      m.user._id === user.id &&
      (m.role === "admin" || m.role === "owner")
  );

  // ---------------- Remove Member ----------------
  const handleRemove = async (memberId) => {
    try {
      await removeMember(teamId, memberId);
      toast.success("Member removed");
      loadTeam();
    } catch {
      toast.error("Failed to remove member");
    }
  };

  // ---------------- Leave Team ----------------
  const handleLeave = async () => {
    try {
      await leaveTeam(teamId);
      toast.success("Left team");
      window.location.href = "/teams";
    } catch {
      toast.error("Failed to leave team");
    }
  };

  // ---------------- Update Task Status ----------------
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTeamTask(teamId, taskId, { status: newStatus });
      loadTeam();
    } catch {
      toast.error("Failed to update task");
    }
  };

  // ---------------- Delete Task ----------------
  const handleDelete = async (taskId) => {
    try {
      await deleteTeamTask(teamId, taskId);
      toast.success("Task deleted");
      loadTeam();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <>
      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          teamId={teamId}
          onClose={() => setShowAddModal(false)}
          onAdded={loadTeam}
        />
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTeamTaskModal
          teamId={teamId}
          members={team.members}
          onClose={() => setShowCreateTask(false)}
          onCreated={loadTeam}
        />
      )}

      <div className="p-6 max-w-4xl mx-auto">
        {/* Team Header */}
        <h2 className="text-2xl font-semibold mb-2">{team.name}</h2>
        <p className="text-gray-600 mb-4">{team.description}</p>

        {/* Members */}
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

        {/* Leave Team */}
        {!isOwner && (
          <button
            onClick={handleLeave}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded"
          >
            Leave Team
          </button>
        )}

        {/* Team Tasks */}
        <h3 className="text-xl font-semibold mt-10 mb-3">Team Tasks</h3>

        {(isOwner || isAdmin) && (
          <button
            onClick={() => setShowCreateTask(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded mb-4"
          >
            + Add Task
          </button>
        )}

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["todo", "in-progress", "done"].map((status) => (
            <div key={status} className="bg-gray-100 p-4 rounded">
              <h4 className="font-semibold mb-3 capitalize">{status}</h4>

              {tasks
                .filter((t) => t.status === status)
                .map((t) => (
                  <div
                    key={t._id}
                    className="bg-white p-3 rounded shadow mb-2 border"
                  >
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-gray-600">{t.description}</p>

                    {t.assignedTo && (
                      <p className="text-xs mt-1 text-gray-500">
                        Assigned to: {t.assignedTo.name}
                      </p>
                    )}

                    <div className="flex justify-between mt-3 text-sm">
                      <select
                        className="border rounded px-1"
                        value={t.status}
                        onChange={(e) =>
                          handleStatusChange(t._id, e.target.value)
                        }
                      >
                        <option value="todo">Todo</option>
                        <option value="in-progress">In-Progress</option>
                        <option value="done">Done</option>
                      </select>

                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
