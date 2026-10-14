import { useState } from "react";
import TaskCard from "./TaskCard";

const colors = {
  Todo: "secondary",
  "In Progress": "primary",
  Review: "warning",
  Done: "success",
};

function Column({ status, tasks, onAdd, onEdit, onDelete, onMove }) {
  const [isOver, setIsOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);

    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    // Same column mein drop = kuch nahi karna
    if (tasks.some((t) => t._id === taskId)) return;

    onMove({ _id: taskId }, status, tasks.length);
  };

  return (
    <div
      className={`card border-0 shadow-sm h-100 ${
        isOver ? "border border-primary bg-primary-subtle" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <div className="card-header bg-transparent border-0 pt-3 px-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0">{status}</h6>
          <span className={`badge text-bg-${colors[status]}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="card-body p-3">
        <button
          className="btn btn-outline-primary btn-sm w-100 mb-3"
          onClick={onAdd}
        >
          + Add Task
        </button>

        {tasks.length === 0 ? (
          <div className="text-center text-secondary small py-4">
            No tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Column;