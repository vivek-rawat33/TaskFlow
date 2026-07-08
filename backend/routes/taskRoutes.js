import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router({ mergeParams: true });

router.get("/", protect, getTasks);
router.post("/", protect, createTask);

router.patch("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);

export default router;
