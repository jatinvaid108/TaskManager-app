import Notification from "../models/Notification.js";

export const createNotification = async (userId, type, message, link = "") => {
  try {
    await Notification.create({
      user: userId,
      type,
      message,
      link
    });
  } catch (err) {
    console.error("❌ Notification Error:", err);
  }
};
