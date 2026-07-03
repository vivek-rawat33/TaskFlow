import { useEffect, useState } from "react";
import { getMyTeams } from "@/api/teamApi";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);

        const data = await getMyTeams();

        setTeams(data.teams || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <p>Loading teams...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400">Manage your teams and tasks</p>
          </div>

          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700">
            Create Team
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-400">
            {error}
          </p>
        )}

        {teams.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <h2 className="text-xl font-semibold">No teams yet</h2>
            <p className="mt-2 text-slate-400">
              Create your first team to start managing tasks.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((item) => (
              <div
                key={item.team._id}
                onClick={() => navigate(`/teams/${item.team._id}`)}
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{item.team.name}</h2>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                    {item.role}
                  </span>
                </div>

                <p className="text-sm text-slate-400">
                  {item.team.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
