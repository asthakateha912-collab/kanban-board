import Board from "../models/Board.js";
import Task from "../models/Task.js";

// Create Board
export const createBoard = async (req, res) => {
  try {
    const board = await Board.create({
      title: req.body.title,
      createdBy: req.body.createdBy,
      members: [req.body.createdBy]
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Board with Tasks
export const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const tasks = await Task.find({
      boardId: board._id
    }).sort({ position: 1 });

    res.json({ board, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Invite Member
export const inviteMember = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: req.body.member } },
      { new: true, runValidators: true }
    );

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    req.app.get("io").to(board._id.toString())
      .emit("memberUpdated", board.members);

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};