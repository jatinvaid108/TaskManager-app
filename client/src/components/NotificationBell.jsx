import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bell Icon */}
          <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label="Notifications"
              aria-expanded={open}
              className="icon-btn relative"
          >
              <Bell size={22} />

              {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white ring-2 ring-night">
                      {unreadCount}
                  </span>
              )}
          </button>

      {/* Dropdown */}
      {open && (
        <div className="card fixed inset-x-4 top-20 z-50 p-3 shadow-2xl shadow-black/50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80">
          <div className="mb-3 flex items-center justify-between px-1">
            <h4 className="font-semibold text-ink">Notifications</h4>

            {unreadCount > 0 && (
              <button
                className="text-sm font-medium text-brand-light hover:text-ink"
                onClick={markAllRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="py-6 text-center text-sm text-ink-subtle">
                No notifications
              </p>
            )}

            {notifications.map((note) => (
              <div
                key={note._id}
                className={`rounded-xl border p-3 ${
                  note.read
                    ? "border-line bg-surface-raised"
                    : "border-brand/20 bg-brand/10"
                }`}
              >
                <p className="text-sm text-ink">{note.message}</p>
                {note.link && (
                  <Link
                    to={note.link}
                    onClick={() => markRead(note._id)}
                    className="mt-1 inline-block text-xs font-medium text-brand-light hover:text-ink"
                  >
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
