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
              onClick={() => setOpen(!open)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
              <Bell
                  size={24}
                  className="stroke-gray-700 hover:stroke-indigo-600 transition"
              />

              {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadCount}
                  </span>
              )}
          </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-3 z-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Notifications</h4>

            {unreadCount > 0 && (
              <button
                className="text-sm text-indigo-600"
                onClick={markAllRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {notifications.length === 0 && (
              <p className="text-gray-500 text-sm text-center">
                No notifications
              </p>
            )}

            {notifications.map((note) => (
              <div
                key={note._id}
                className={`p-3 rounded-lg border ${
                  note.read ? "bg-gray-100" : "bg-indigo-50"
                }`}
              >
                <p className="text-sm">{note.message}</p>
                {note.link && (
                  <Link
                    to={note.link}
                    onClick={() => markRead(note._id)}
                    className="text-xs text-indigo-600"
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
