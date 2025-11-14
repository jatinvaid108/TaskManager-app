import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

import {
  getTasksPerDay,
  getCompletionStats,
  getPriorityStats,
  getUserGrowth
} from "../api/adminApi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function AdminAnalytics() {
  const [tasksDaily, setTasksDaily] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const daily = await getTasksPerDay();
      const completion = await getCompletionStats();
      const priority = await getPriorityStats();
      const growth = await getUserGrowth();

      // Format pie data
      setCompletionData(
        completion.map((item) => ({
          name: item._id ? "Completed" : "Pending",
          value: item.count
        }))
      );

      setPriorityData(
        priority.map((item) => ({
          name: item._id || "No priority",
          value: item.count
        }))
      );

      setTasksDaily(daily);
      setUserGrowth(growth);
    } catch (err) {
      console.error("Analytics load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <p>Loading analytics...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-6">Analytics & Insights</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Tasks Per Day */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Tasks Created Per Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tasksDaily}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">User Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution Pie */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {priorityData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={["#6366f1", "#f43f5e", "#facc15", "#14b8a6"][index % 4]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Stats Pie */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Completed vs Pending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={completionData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {completionData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={["#22c55e", "#ef4444"][index % 2]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </AdminLayout>
  );
}
