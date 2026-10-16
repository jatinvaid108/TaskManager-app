import { useEffect, useState } from "react";
import { getMyTeams } from "../api/teamApi";
import { Link } from "react-router-dom";
import { ChevronRight, Plus, RotateCcw, Users } from "lucide-react";
import { ClipLoader } from "react-spinners";
import CreateTeamModal from "../components/CreateTeamModal";
import DashboardLayout from "../../layout/DashboardLayout.jsx";
import Avatar from "../../components/Avatar.jsx";
import { useAuth } from "../../context/AuthContext";

// Accent color per team (picked from the team id so it stays stable)
const accents = [
  { border: "border-l-violet-500", tile: "border-violet-500/30 bg-violet-500/10 text-violet-400" },
  { border: "border-l-blue-500", tile: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
  { border: "border-l-emerald-500", tile: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  { border: "border-l-amber-500", tile: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
];

const pickAccent = (id = "") =>
  accents[[...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % accents.length];

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const res = await getMyTeams();
      setTeams(res.teams || []);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {showCreate && (
        <CreateTeamModal onClose={() => setShowCreate(false)} onCreated={loadTeams} />
      )}

      {/* ---------- Header ---------- */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">My Teams</h1>
          <p className="mt-1 text-ink-muted">Manage and collaborate with your teams.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary shrink-0 px-5 py-3 shadow-glow-sm"
        >
          <Plus size={18} /> Create Team
        </button>
      </div>

      {/* ---------- Team List ---------- */}
      {loading ? (
        <div className="flex justify-center mt-16">
          <ClipLoader color="#A78BFA" size={40} />
        </div>
      ) : error ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <p className="font-medium text-ink">Couldn’t load your teams.</p>
          <p className="mt-1 text-sm text-ink-subtle">Check your connection and try again.</p>
          <button onClick={loadTeams} className="btn-ghost mt-5">
            <RotateCcw size={16} /> Retry
          </button>
        </div>
      ) : teams.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <div className="icon-tile mb-4 h-14 w-14 text-brand-light">
            <Users size={26} />
          </div>
          <p className="font-medium text-ink">No teams yet.</p>
          <p className="mt-1 text-sm text-ink-subtle">Create a team to start collaborating.</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary mt-5">
            <Plus size={18} /> Create Team
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => {
            const accent = pickAccent(team._id);
            const myRole = team.members.find((m) => m.user?._id === user?.id)?.role;
            const shown = team.members.slice(0, 3);
            const extra = team.members.length - shown.length;

            return (
              <Link
                key={team._id}
                to={`/teams/${team._id}`}
                className={`card group flex flex-col gap-5 border-l-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-hover/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light/40 sm:flex-row sm:items-center sm:p-6 ${accent.border}`}
              >
                {/* Icon + name */}
                <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${accent.tile}`}>
                    <Users size={26} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-lg font-semibold text-ink">{team.name}</p>
                      {(myRole === "owner" || myRole === "admin") && (
                        <span className="badge bg-brand/15 capitalize text-brand-light">{myRole}</span>
                      )}
                    </div>
                    {team.description && (
                      <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">{team.description}</p>
                    )}
                  </div>
                </div>

                <div className="hidden h-12 w-px bg-line sm:block" />

                {/* Members */}
                <div className="flex items-center gap-3 sm:w-60">
                  <div className="flex -space-x-2">
                    {shown.map((m) => (
                      <Avatar
                        key={m.user?._id}
                        name={m.user?.name}
                        id={m.user?._id}
                        className="ring-2 ring-surface"
                      />
                    ))}
                    {extra > 0 && (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold text-ink ring-2 ring-surface">
                        +{extra}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink-muted">
                    {team.members.length} {team.members.length === 1 ? "member" : "members"}
                  </p>
                </div>

                {/* Open */}
                <span className="icon-tile hidden h-10 w-10 shrink-0 text-ink-muted transition-colors group-hover:border-line-strong group-hover:text-ink sm:flex">
                  <ChevronRight size={20} />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
