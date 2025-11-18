import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTeamTask,
  getTeamTasks,
  updateTeamTask,
  deleteTeamTask
} from "../controllers/teamTaskController.js";

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post("/", createTeamTask);
router.get("/", getTeamTasks);
router.put("/:taskId", updateTeamTask);
router.delete("/:taskId", deleteTeamTask);

export default router;
