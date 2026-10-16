import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const SURFACE = "#0F0F19";
const EMPTY_RING = "#1F1F2E";

function DistributionTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const slice = payload[0];
  return (
    <div className="rounded-xl border border-line-strong bg-surface-raised px-3 py-2 text-sm shadow-xl">
      <p className="text-ink-muted">{slice.name}</p>
      <p className="font-semibold text-ink">{slice.value}</p>
    </div>
  );
}

export default function TaskDistributionChart({ pending, completed, deleted, className = "" }) {
  // Colors validated for color-blind separation on the dark card surface
  const segments = [
    { name: "Pending", value: pending, color: "#D97706" },
    { name: "Completed", value: completed, color: "#0D9488" },
    { name: "Trash", value: deleted, color: "#E11D48" },
  ];

  const total = pending + completed + deleted;
  const visible = segments.filter((s) => s.value > 0);
  const percent = (value) => (total ? Math.round((value / total) * 100) : 0);

  return (
    <div className={`card p-6 ${className}`}>
      <h2 className="mb-6 text-lg font-semibold text-ink">Task Distribution</h2>

      <div className="flex flex-col items-center gap-8 sm:flex-row">
        {/* Donut */}
        <div className="relative h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={total ? visible : [{ name: "No tasks", value: 1 }]}
                dataKey="value"
                innerRadius="70%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                stroke={SURFACE}
                strokeWidth={2}
              >
                {total
                  ? visible.map((s) => <Cell key={s.name} fill={s.color} />)
                  : <Cell fill={EMPTY_RING} />}
              </Pie>
              {total > 0 && <Tooltip content={<DistributionTooltip />} />}
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-ink">{total}</span>
            <span className="text-xs text-ink-muted">Total</span>
          </div>
        </div>

        {/* Legend (doubles as the data table) */}
        <ul className="w-full space-y-4">
          {segments.map((s) => (
            <li key={s.name} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-3 text-ink">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}
              </span>
              <span className="text-ink-muted">
                {s.value} ({percent(s.value)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
