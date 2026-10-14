import express from "express";
import {
  createBoard,
  getBoard,
  inviteMember
} from "../controller/boardController.js";

const router = express.Router();

router.post("/", createBoard);
router.get("/:id", getBoard);
router.post("/:id/members", inviteMember);

export default router;