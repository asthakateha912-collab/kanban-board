import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import Navbar from "./Navbar";
import Column from "./Column";
import TaskModal from "./TaskModel";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API.replace("/api", "");

const socket = io(SOCKET_URL, { autoConnect: false });

const statuses = ["Todo", "In Progress", "Review", "Done"];

function Board() {
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [boardTitle, setBoardTitle] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("Todo");

  const [onlineMembers, setOnlineMembers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------- Create Board ----------
  const createBoard = async () => {
    if (!boardTitle.trim()) {
      alert("Please enter a board name.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/boards`, {
        title: boardTitle,
        createdBy: "User",
      });

      const newBoard = res.data.board || res.data;
      if (!newBoard._id) {
        alert("Board ID was not found in the API response.");
        return;
      }

      localStorage.setItem("boardId", newBoard._id); // persist
      setBoard(newBoard);
      setTasks([]);
      setBoardTitle("");
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Failed to create board.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Load Board ----------
  const loadBoard = async (boardId) => {
    try {
      const res = await axios.get(`${API}/boards/${boardId}`);
      setBoard(res.data.board || res.data);
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.log(error.response?.data || error);
      localStorage.removeItem("boardId"); // bad id -> clean up
    }
  };

  // Page load pe saved board wapas laao
  useEffect(() => {
    const savedId = localStorage.getItem("boardId");
    if (savedId) loadBoard(savedId);
  }, []);

  // ---------- Socket events ----------
  useEffect(() => {
    socket.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onCreated = (task) =>
      setTasks((prev) =>
        prev.some((t) => t._id === task._id) ? prev : [...prev, task]
      );

    const onUpdated = (updated) =>
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );

    const onDeleted = (taskId) =>
      setTasks((prev) => prev.filter((t) => t._id !== taskId));

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("taskCreated", onCreated);
    socket.on("taskUpdated", onUpdated);
    socket.on("taskMoved", onUpdated);
    socket.on("taskDeleted", onDeleted);
    socket.on("onlineMembers", setOnlineMembers);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("taskCreated", onCreated);
      socket.off("taskUpdated", onUpdated);
      socket.off("taskMoved", onUpdated);
      socket.off("taskDeleted", onDeleted);
      socket.off("onlineMembers", setOnlineMembers);
      socket.disconnect();
    };
  }, []);

  // ---------- Join board room ----------
  useEffect(() => {
    if (!board?._id) return;

    const joinBoard = () => socket.emit("joinBoard", board._id);

    socket.on("connect", joinBoard);
    if (socket.connected) joinBoard();

    return () => socket.off("connect", joinBoard);
  }, [board?._id]);

  // ---------- Modal ----------
  const openAddModal = (status = "Todo") => {
    if (!board?._id) {
      alert("Please create a board first.");
      return;
    }
    setSelectedTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setDefaultStatus(task.status || "Todo");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  // ---------- Save Task ----------
  const saveTask = async (form) => {
    if (!board?._id) return;

    try {
      if (selectedTask?._id) {
        const res = await axios.put(`${API}/tasks/${selectedTask._id}`, form);
        const updated = res.data.task || res.data;
        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        );
      } else {
        const res = await axios.post(`${API}/tasks`, {
          ...form,
          boardId: board._id,
          position: tasks.length,
          status: form.status || defaultStatus,
        });
        const created = res.data.task || res.data;
        setTasks((prev) =>
          prev.some((t) => t._id === created._id) ? prev : [...prev, created]
        );
      }
      closeModal();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Failed to save task.");
    }
  };

  // ---------- Delete Task ----------
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API}/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Failed to delete task.");
    }
  };

  // ---------- Move Task (optimistic) ----------
  const moveTask = async (task, status, position) => {
    const backup = tasks;

    // UI turant update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status, position } : t))
    );

    try {
      const res = await axios.put(`${API}/tasks/${task._id}`, {
        status,
        position,
      });
      const updated = res.data.task || res.data;
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch (error) {
      console.log(error.response?.data || error);
      setTasks(backup); // fail hua to rollback
      alert("Failed to move task.");
    }
  };

  const isOnline = connected || onlineMembers.length > 0;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar
        boardName={board?.title || "My Kanban Board"}
        online={isOnline}
        onAddTask={() => openAddModal("Todo")}
      />

      <div className="container-fluid py-4 px-3 px-md-4">
        {!board && (
          <div className="card shadow-sm border-0 p-4 mb-4">
            <h4 className="mb-3">Create Your Board</h4>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter board name"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createBoard()}
              />
              <button
                className="btn btn-primary"
                onClick={createBoard}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Board"}
              </button>
            </div>
          </div>
        )}

        {board && (
          <>
            <div className="mb-4">
              <h3>{board.title}</h3>
              <p className="text-muted mb-0">Manage your tasks here</p>
            </div>

            <div className="row g-3">
              {statuses.map((status) => (
                <div className="col-12 col-md-6 col-xl-3" key={status}>
                  <Column
                    status={status}
                    tasks={tasks
                      .filter((t) => t.status === status)
                      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))}
                    onAdd={() => openAddModal(status)}
                    onEdit={openEditModal}
                    onDelete={deleteTask}
                    onMove={moveTask}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <TaskModal
          task={selectedTask}
          defaultStatus={defaultStatus}
          onSave={saveTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Board;