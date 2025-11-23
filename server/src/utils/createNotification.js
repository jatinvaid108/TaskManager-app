import Notification from "../models/Notification.js";

export const createNotification = async (userId, type, message, link = "") => {
  try {
    const note = await Notification.create({
      user: userId,
      type,
      message,
      link,
    });

    // 🔔 If socket.io is available, emit to that user
    if (globalThis.io) {
      globalThis.io
        .to(userId.toString())
        .emit("notification:new", {
          _id: note._id,
          type: note.type,
          message: note.message,
          link: note.link,
          read: note.read,
          createdAt: note.createdAt,
        });
    }

    return note;
  } catch (err) {
    console.error("❌ Notification Error:", err);
  }
};
