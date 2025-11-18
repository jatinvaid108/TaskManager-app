import { useEffect, useState } from "react";
import { getMyTeams } from "../api/teamApi";
import { Link } from "react-router-dom";
import CreateTeamModal from "../components/CreateTeamModal";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const res = await getMyTeams();
      setTeams(res.teams || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {showCreate && (
        <CreateTeamModal onClose={() => setShowCreate(false)} onCreated={loadTeams} />
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Teams</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            + Create Team
          </button>
        </div>

        <div className="space-y-3">
          {teams.map((team) => (
            <Link
              key={team._id}
              to={`/teams/${team._id}`}
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <p className="font-medium">{team.name}</p>
              <p className="text-sm text-gray-500">{team.members.length} members</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
