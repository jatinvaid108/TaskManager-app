// Small status / priority labels shared by task cards and tables

const priorityStyles = {
  high: { badge: "bg-red-500/10 text-red-400", dot: "bg-red-500" },
  medium: { badge: "bg-amber-500/10 text-amber-400", dot: "bg-amber-500" },
  low: { badge: "bg-green-500/10 text-green-400", dot: "bg-green-500" },
};

const fallbackStyle = { badge: "bg-surface-hover text-ink-muted", dot: "bg-ink-subtle" };

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export function StatusBadge({ completed, withDot = false }) {
  const style = completed
    ? { badge: "bg-brand/15 text-brand-light", dot: "bg-brand-light" }
    : { badge: "bg-amber-500/10 text-amber-400", dot: "bg-amber-500" };

  return (
    <span className={`badge ${style.badge}`}>
      {withDot && <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />}
      {completed ? "Completed" : "Pending"}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const style = priorityStyles[priority] || fallbackStyle;
  return <span className={`badge ${style.badge}`}>{capitalize(priority || "normal")}</span>;
}

export function PriorityLabel({ priority }) {
  const style = priorityStyles[priority] || fallbackStyle;
  return (
    <span className="inline-flex items-center gap-2 text-ink">
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {capitalize(priority || "normal")}
    </span>
  );
}
