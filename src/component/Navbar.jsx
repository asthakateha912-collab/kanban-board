
import { Link, NavLink } from "react-router-dom";

function Navbar({ boardName, online, onAddTask }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid px-3 px-md-4">

        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          TaskMate
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div
          className="collapse navbar-collapse"
          id="navbarMenu"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/board">
                My Board
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">
                Dashboard
              </NavLink>
            </li>

          </ul>

          {/* Right Side */}
          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3">

            {/* Board Name */}
            <span className="text-white">
              {boardName || "My Kanban Board"}
            </span>

            {/* Online Status */}
            <span className="text-success">
              ● {online ? "Online" : "Offline"}
            </span>

            {/* Add Task Button */}
            <button
              type="button"
              className="btn btn-success"
              onClick={onAddTask}
            >
              + Add Task
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
