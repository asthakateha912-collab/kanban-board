import express from "express";
import {
  createTask,
  updateTask,
  moveTask,
  deleteTask
} from "../controller/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.put("/:id", updateTask);
router.put("/:id/move", moveTask);
router.delete("/:id", deleteTask);

export default router;