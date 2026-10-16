// Icon circle colors (same hues as the Task Distribution chart)
const tones = {
  violet: "bg-brand/10 text-brand-light ring-brand/30 shadow-[0_0_24px_-6px_rgba(124,58,237,0.6)]",
  teal: "bg-teal-500/10 text-teal-400 ring-teal-500/30 shadow-[0_0_24px_-6px_rgba(20,184,166,0.5)]",
  amber: "bg-amber-500/10 text-amber-400 ring-amber-500/30 shadow-[0_0_24px_-6px_rgba(245,158,11,0.5)]",
  rose: "bg-rose-500/10 text-rose-400 ring-rose-500/30 shadow-[0_0_24px_-6px_rgba(244,63,94,0.5)]",
};

export default function StatCard({ title, count, icon, caption, tone = "violet" }) {
  return (
    <div className="card flex items-start gap-4 p-5 transition-colors hover:border-line-strong">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-1 ${tones[tone]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-medium text-ink-muted">{title}</h3>
        <p className="mt-1 text-3xl font-bold text-ink">{count}</p>
        {caption && <p className="mt-2 text-xs text-ink-subtle">{caption}</p>}
      </div>
    </div>
  );
}
