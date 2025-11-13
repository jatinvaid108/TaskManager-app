import User from "../models/User.js";
import Todo from "../models/Todo.js";

// Daily tasks created (last 7 days)
export const tasksPerDay = async (req, res) => {
  try {
    const data = await Todo.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Completed vs Pending stats
export const taskCompletionStats = async (req, res) => {
  try {
    const data = await Todo.aggregate([
      {
        $group: {
          _id: "$completed",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Priority distribution
export const priorityStats = async (req, res) => {
  try {
    const data = await Todo.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User growth over time
export const userGrowth = async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
