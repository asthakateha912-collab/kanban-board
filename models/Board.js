import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  members: [{
    type: String
  }]
});

export default mongoose.model("Board", boardSchema);