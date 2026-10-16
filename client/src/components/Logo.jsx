import { Check } from "lucide-react";

// Brand lockup used by the sidebar and the public pages
export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-glow-sm">
        <Check size={20} strokeWidth={3} className="text-white" />
      </span>
      <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-ink">
        TaskManager <span className="text-brand-light">Pro</span>
      </span>
    </span>
  );
}
