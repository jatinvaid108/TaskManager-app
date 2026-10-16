import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BRAND = "#8B5CF6";
const AXIS_TEXT = "#6B6B80";
const GRID = "#1F1F2E";
const SURFACE = "#0F0F19";

// Count how many tasks were created on each of the last 7 days
const buildLast7Days = (tasks) =>
  Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - (6 - i));

    return {
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: tasks.filter(
        (t) => new Date(t.createdAt).toDateString() === day.toDateString()
      ).length,
    };
  });

function OverviewTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-line-strong bg-surface-raised px-3 py-2 text-sm shadow-xl">
      <p className="text-ink-muted">{point.day}, {point.date}</p>
      <p className="font-semibold text-ink">
        {point.count} {point.count === 1 ? "task" : "tasks"} created
      </p>
    </div>
  );
}

export default function TasksOverviewChart({ tasks, className = "" }) {
  const data = buildLast7Days(tasks);

  return (
    <div className={`card p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-ink">Tasks Overview</h2>
        <p className="text-sm text-ink-subtle">Tasks created in the last 7 days</p>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="overviewFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
                <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: AXIS_TEXT, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: AXIS_TEXT, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<OverviewTooltip />} cursor={{ stroke: "#2A2A3D" }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke={BRAND}
              strokeWidth={2}
              fill="url(#overviewFill)"
              dot={{ r: 4, fill: BRAND, stroke: SURFACE, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: BRAND, stroke: SURFACE, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
