import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  getAllUsers,
  deleteUser,
  getAllTasks,
  hardDeleteTask,
  getSystemStats
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly);

// User Management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Task Management
router.get("/tasks", getAllTasks);
router.delete("/tasks/:id", hardDeleteTask);

// System Stats
router.get("/stats", getSystemStats);

export default router;
