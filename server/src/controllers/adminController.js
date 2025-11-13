import User from "../models/User.js";
import Todo from "../models/Todo.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user + all their todos
export const deleteUser = async (req, res) => {
  try {
    await Todo.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "User and all their tasks deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — Get all tasks (system-wide)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Todo.find()
      .populate("user", "name email"); // FIXED

    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hard delete a task
export const hardDeleteTask = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Task permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// System analytics
export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Todo.countDocuments();
    const completedTasks = await Todo.countDocuments({ completed: true });
    const deletedTasks = await Todo.countDocuments({ deleted: true });

    res.json({
      success: true,
      stats: { totalUsers, totalTasks, completedTasks, deletedTasks },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
