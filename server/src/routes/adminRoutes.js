import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllUsers, deleteUser, getAllTasks, hardDeleteTask } from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require both protect + adminOnly
router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/tasks", getAllTasks);
router.delete("/tasks/:id", hardDeleteTask);

export default router;


