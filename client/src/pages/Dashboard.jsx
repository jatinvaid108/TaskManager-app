import DashboardLayout from "../layout/DashboardLayout.jsx";
import StatCard from "../components/StatCard.jsx";
import { ClipboardList, CheckCircle2, Clock, Trash2 } from "lucide-react";
import api from "../utils/api.js";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    deleted: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // -------- Fetch all tasks --------
        const res = await api.get("/todos");
        const tasks = res.data.tasks || [];

        const total = tasks.length;
        const completed = tasks.filter((t) => t.completed).length;
        const pending = tasks.filter((t) => !t.completed).length;

        // -------- Fetch deleted tasks count --------
        const deletedRes = await api.get("/todos?deleted=true");
        const deletedCount = deletedRes.data.tasks?.length || 0;

        setStats({
          total,
          completed,
          pending,
          deleted: deletedCount,
        });

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          count={stats.total}
          icon={<ClipboardList size={32} />}
        />
        <StatCard
          title="Completed"
          count={stats.completed}
          icon={<CheckCircle2 size={32} />}
        />
        <StatCard
          title="Pending"
          count={stats.pending}
          icon={<Clock size={32} />}
        />
        <StatCard
          title="Trash"
          count={stats.deleted}
          icon={<Trash2 size={32} />}
        />
      </div>
    </DashboardLayout>
  );
}
