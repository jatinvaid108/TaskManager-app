import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, notifications: notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
