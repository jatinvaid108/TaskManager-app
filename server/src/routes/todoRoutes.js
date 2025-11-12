import express from "express";
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo, restoreTodo, markAllCompleted } from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router();

// all routes below are protected (user must be logged in)
router.use(protect);


router.post("/",createTodo);
router.get("/",getTodos);
router.get("/:id",getTodoById);   // get single task
router.put("/:id",updateTodo);
router.delete("/:id",deleteTodo);     // soft delete task
router.put("/restore/:id", restoreTodo);
router.put("/mark-all-completed", protect, markAllCompleted); //extra frontend button

export default router;


//Instead of repeating protect in every line, we attach it once to the whole router.
