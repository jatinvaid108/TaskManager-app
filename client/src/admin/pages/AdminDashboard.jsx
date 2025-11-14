import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import StatsCard from "../components/StatsCard";
import { getAdminStats } from "../api/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Stats fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <AdminLayout><p>Loading stats...</p></AdminLayout>;

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-6">Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          color="text-blue-600"
        />

        <StatsCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          color="text-purple-600"
        />

        <StatsCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          color="text-green-600"
        />

        <StatsCard
          title="Deleted Tasks"
          value={stats?.deletedTasks || 0}
          color="text-red-600"
        />

      </div>
    </AdminLayout>
  );
}
