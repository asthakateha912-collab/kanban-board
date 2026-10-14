
function TaskCard({ task, onEdit, onDelete }) {
  const priorityColors = {
    Low: "success",
    Medium: "warning",
    High: "danger",
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task._id);
  };

  return (
    <div
      className="card border mb-3 shadow-sm"
      draggable
      onDragStart={handleDragStart}
      style={{ cursor: "grab" }}
    >
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h6 className="fw-bold mb-0 text-break">{task.title}</h6>

          <span
            className={`badge text-bg-${priorityColors[task.priority] || "secondary"}`}
          >
            {task.priority || "Low"}
          </span>
        </div>

        {task.description && (
          <p className="text-secondary small mb-3 text-break">
            {task.description}
          </p>
        )}

        <div className="small text-secondary mb-2">
          <div className="mb-1">
            <strong>Assigned:</strong> {task.assignedTo || "Unassigned"}
          </div>

          <div>
            <strong>Due:</strong>{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No due date"}
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-sm btn-outline-primary flex-fill"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>

          <button
            className="btn btn-sm btn-outline-danger flex-fill"
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
