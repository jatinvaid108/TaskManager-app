import express from "express";
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo, restoreTodo, markAllCompleted,restoreAll,assignTask,unassignTask } from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// all routes below are protected (user must be logged in)
router.use(protect);

/* ---------- SPECIAL ROUTES (must come first) ---------- */
router.put("/mark-all-completed", markAllCompleted);
router.put("/restore-all", restoreAll);

/* ---------- TASK CRUD ROUTES ---------- */
router.post("/", createTodo);
router.get("/", getTodos);

router.put("/restore/:id", restoreTodo);

router.put("/:id/assign", assignTask);
router.put("/:id/unassign", unassignTask);

router.get("/:id", getTodoById);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
