import Task from "../models/Task.js";
import Board from "../models/Board.js";

// Create Task
export const createTask = async (req, res) => {
  try {
    const board = await Board.findById(req.body.boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const task = await Task.create(req.body);

    req.app.get("io").to(board._id.toString())
      .emit("taskCreated", task);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    req.app.get("io").to(task.boardId.toString())
      .emit("taskUpdated", task);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Move Task
export const moveTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        position: req.body.position
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    req.app.get("io").to(task.boardId.toString())
      .emit("taskMoved", task);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    req.app.get("io").to(task.boardId.toString())
      .emit("taskDeleted", task._id.toString());

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};