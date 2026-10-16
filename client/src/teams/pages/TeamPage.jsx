import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, LogOut, Plus, Trash2, UserMinus, Users } from "lucide-react";
import { ClipLoader } from "react-spinners";

import {
  getTeamById,
  removeMember,
  leaveTeam,
  getTeamTasks,
  updateTeamTask,
  deleteTeamTask
} from "../api/teamApi";

import AddMemberModal from "../components/AddMemberModal";
import CreateTeamTaskModal from "../components/CreateTeamTaskModal";
import DashboardLayout from "../../layout/DashboardLayout.jsx";
import Avatar from "../../components/Avatar.jsx";
import { formatDate } from "../../utils/formatDate.js";

import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// Kanban columns (status values come from the backend)
const columns = [
  { status: "todo", label: "To Do", dot: "bg-ink-subtle" },
  { status: "in-progress", label: "In Progress", dot: "bg-amber-500" },
  { status: "done", label: "Done", dot: "bg-teal-500" },
];

const roleBadge = {
  owner: "bg-brand/15 text-brand-light",
  admin: "bg-blue-500/10 text-blue-400",
  member: "bg-surface-hover text-ink-muted",
};

export default function TeamPage() {
  const { teamId } = useParams();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [loadError, setLoadError] = useState(false);

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
      setLoadError(true);
    }
  };

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  if (!team)
    return (
      <DashboardLayout>
        {loadError ? (
          <div className="card flex flex-col items-center px-6 py-16 text-center">
            <p className="font-medium text-ink">Couldn’t load this team.</p>
            <p className="mt-1 text-sm text-ink-subtle">
              It may not exist, or you may no longer be a member.
            </p>
            <Link to="/teams" className="btn-ghost mt-5">
              <ArrowLeft size={16} /> Back to Teams
            </Link>
          </div>
        ) : (
          <div className="flex justify-center mt-16">
            <ClipLoader color="#A78BFA" size={40} />
          </div>
        )}
      </DashboardLayout>
    );

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
    <DashboardLayout>
      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          teamId={teamId}
          onClose={() => setShowAddModal(false)}
          onAdded={(response) => setTeam(response.team)}
          currentMembers={team.members}
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

      <Link
        to="/teams"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> Back to Teams
      </Link>

      {/* ---------- Team Header ---------- */}
      <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand-light ring-1 ring-brand/30">
            <Users size={30} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="break-words text-2xl font-bold tracking-tight text-ink sm:text-3xl">{team.name}</h1>
              <span className="badge bg-brand/15 text-brand-light">
                {team.members.length} {team.members.length === 1 ? "Member" : "Members"}
              </span>
            </div>
            {team.description && <p className="mt-1 text-ink-muted">{team.description}</p>}
            {team.createdAt && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-subtle">
                <CalendarDays size={15} /> Created on {formatDate(team.createdAt)}
              </p>
            )}
          </div>
        </div>

        {/* Leave Team */}
        {!isOwner && (
          <button
            onClick={handleLeave}
            className="btn-ghost shrink-0 border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
          >
            <LogOut size={16} /> Leave Team
          </button>
        )}
      </div>

      {/* ---------- Members ---------- */}
      <div className="card mt-6 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Members</h2>

          {(isOwner || isAdmin) && (
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <Plus size={18} /> Add Member
            </button>
          )}
        </div>

        <div className="divide-y divide-line overflow-hidden rounded-xl border border-line">
          {team.members.map((m) => (
            <div
              key={m.user._id}
              className="flex flex-col gap-3 bg-surface-raised/40 px-4 py-3 transition-colors hover:bg-surface-hover/60 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={m.user.name} id={m.user._id} size="lg" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">
                    {m.user.name}
                    {m.user._id === user.id && (
                      <span className="ml-2 text-xs font-normal text-ink-subtle">(You)</span>
                    )}
                  </p>
                  <p className="truncate text-sm text-ink-muted">{m.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-14 sm:pl-0">
                <span className={`badge capitalize ${roleBadge[m.role] || roleBadge.member}`}>
                  {m.role}
                </span>

                {(isOwner || isAdmin) && m.role !== "owner" && (
                  <button
                    onClick={() => handleRemove(m.user._id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
                  >
                    <UserMinus size={16} /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Team Tasks ---------- */}
      <div className="card mt-6 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Team Tasks</h2>

          {(isOwner || isAdmin) && (
            <button onClick={() => setShowCreateTask(true)} className="btn-primary">
              <Plus size={18} /> Add Task
            </button>
          )}
        </div>

        {/* Task Board */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {columns.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.status);
            return (
              <div key={column.status} className="rounded-xl border border-line bg-night-light/60 p-3">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span className={`h-2 w-2 rounded-full ${column.dot}`} />
                  <h3 className="font-semibold text-ink">{column.label}</h3>
                  <span className="rounded-md bg-surface-hover px-1.5 py-0.5 text-xs text-ink-muted">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnTasks.length === 0 && (
                    <p className="rounded-lg border border-dashed border-line px-3 py-6 text-center text-sm text-ink-subtle">
                      No tasks
                    </p>
                  )}

                  {columnTasks.map((t) => (
                    <div
                      key={t._id}
                      className="rounded-xl border border-line bg-surface-raised p-4 transition-colors hover:border-line-strong"
                    >
                      <p className="break-words font-medium text-ink">{t.title}</p>
                      {t.description && (
                        <p className="mt-1 break-words text-sm text-ink-muted">{t.description}</p>
                      )}

                      {t.assignedTo && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
                          <Avatar name={t.assignedTo.name} id={t.assignedTo._id} size="sm" />
                          <span className="truncate">Assigned to {t.assignedTo.name}</span>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
                        <label className="sr-only" htmlFor={`status-${t._id}`}>Status</label>
                        <select
                          id={`status-${t._id}`}
                          className="rounded-lg border border-line bg-surface px-2 py-1.5 text-xs text-ink transition-colors focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
                          value={t.status}
                          onChange={(e) =>
                            handleStatusChange(t._id, e.target.value)
                          }
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>

                        <button
                          onClick={() => handleDelete(t._id)}
                          aria-label="Delete task"
                          className="icon-btn h-8 w-8 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
