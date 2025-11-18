import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Search users by email
router.get("/search", protect, async (req, res) => {
  try {
    const q = req.query.email;
    if (!q) return res.json({ users: [] });

    const users = await User.find({
      email: { $regex: q, $options: "i" }
    }).select("name email _id");

    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
