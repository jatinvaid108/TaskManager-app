import { Trash2 } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This task will be moved to Trash.",
  confirmLabel = "Delete",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-sm p-6 text-center shadow-2xl shadow-black/50">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 ring-1 ring-red-500/30">
          <Trash2 size={22} />
        </div>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-ink-muted">{message}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary flex-1 bg-red-600 hover:bg-red-700 focus-visible:ring-red-400/60"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
