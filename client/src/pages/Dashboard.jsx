import DashboardLayout from "../layout/DashboardLayout.jsx";
import StatCard from "../components/StatCard.jsx";
import TasksOverviewChart from "../components/TasksOverviewChart.jsx";
import TaskDistributionChart from "../components/TaskDistributionChart.jsx";
import RecentTasks from "../components/RecentTasks.jsx";
import { ClipboardList, CheckCircle2, Clock, Trash2 } from "lucide-react";
import api, { TASK_LIMIT } from "../utils/api.js";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    deleted: 0,
  });
  const [tasks, setTasks] = useState([]);

  const location= useLocation();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // -------- Fetch all tasks --------
        const res = await api.get("/todos", { params: { limit: TASK_LIMIT } });
        const taskList = res.data.tasks || [];

        const total = taskList.length;
        const completed = taskList.filter((t) => t.completed).length;
        const pending = taskList.filter((t) => !t.completed).length;

        // -------- Fetch deleted tasks count --------
        const deletedRes = await api.get("/todos?deleted=true", { params: { limit: TASK_LIMIT } });
        const deletedCount = deletedRes.data.tasks?.length || 0;

        setStats({
          total,
          completed,
          pending,
          deleted: deletedCount,
        });
        setTasks(taskList);

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

     fetchStats();
}, [location.pathname]);   // THIS IS THE FIX for Completed task issue

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Dashboard</h1>
        <p className="mt-1 text-ink-muted">Here’s what’s happening with your tasks today.</p>
      </div>

      {/* ---------- Statistics ---------- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tasks"
          count={stats.total}
          caption="All tasks created"
          tone="violet"
          icon={<ClipboardList size={26} />}
        />
        <StatCard
          title="Completed"
          count={stats.completed}
          caption="Tasks completed"
          tone="teal"
          icon={<CheckCircle2 size={26} />}
        />
        <StatCard
          title="Pending"
          count={stats.pending}
          caption="Tasks pending"
          tone="amber"
          icon={<Clock size={26} />}
        />
        <StatCard
          title="Trash"
          count={stats.deleted}
          caption="Tasks removed"
          tone="rose"
          icon={<Trash2 size={26} />}
        />
      </div>

      {/* ---------- Charts ---------- */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <TasksOverviewChart tasks={tasks} className="xl:col-span-3" />
        <TaskDistributionChart
          pending={stats.pending}
          completed={stats.completed}
          deleted={stats.deleted}
          className="xl:col-span-2"
        />
      </div>

      {/* ---------- Recent Tasks ---------- */}
      <RecentTasks tasks={tasks.slice(0, 5)} className="mt-6" />
    </DashboardLayout>
  );
}
