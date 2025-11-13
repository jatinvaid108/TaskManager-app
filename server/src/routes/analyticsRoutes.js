import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  tasksPerDay,
  taskCompletionStats,
  priorityStats,
  userGrowth
} from "../controllers/analyticsController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/tasks/daily", tasksPerDay);
router.get("/tasks/completion", taskCompletionStats);
router.get("/tasks/priority", priorityStats);
router.get("/users/growth", userGrowth);

export default router;
