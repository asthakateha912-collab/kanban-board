import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  dueDate: Date,
  assignedTo: String,
  status: {
    type: String,
    enum: ["Todo", "In Progress", "Review", "Done"],
    default: "Todo"
  },
  position: {
    type: Number,
    default: 0
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);