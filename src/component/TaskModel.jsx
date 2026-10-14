import { useState } from "react";

function TaskModal({ task, defaultStatus = "Todo", onSave, onClose }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "Medium",
    assignedTo: task?.assignedTo || "",
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toISOString().slice(0, 10)
      : "",
    status: task?.status || defaultStatus,
    position: task?.position ?? 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Enter task title");
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      dueDate: form.dueDate || null,
      position: Number(form.position),
    });
  };

  return (
    <>
      <div className="modal d-block" tabIndex="-1" onClick={onClose}>
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {task ? "Edit Task" : "Create Task"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body d-grid gap-3">
              <input
                className="form-control"
                name="title"
                placeholder="Task title"
                value={form.title}
                onChange={handleChange}
                autoFocus
                required
              />

              <textarea
                className="form-control"
                name="description"
                rows="3"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />

              <div className="row g-2">
                <div className="col">
                  <select
                    className="form-select"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="col">
                  <select
                    className="form-select"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>Done</option>
                  </select>
                </div>
              </div>

              <input
                className="form-control"
                name="assignedTo"
                placeholder="Assigned member"
                value={form.assignedTo}
                onChange={handleChange}
              />

              <div>
                <label className="form-label small text-secondary">
                  Due date
                </label>
                <input
                  className="form-control"
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {task ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}

export default TaskModal;