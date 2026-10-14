import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import boardRoutes from "./routes/boardRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinBoard", (boardId) => {
    socket.join(boardId);
    console.log("User joined board:", boardId);
  });

  socket.on("typing", (data) => {
    socket.to(data.boardId).emit("userTyping", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Kanban Board API is running");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });