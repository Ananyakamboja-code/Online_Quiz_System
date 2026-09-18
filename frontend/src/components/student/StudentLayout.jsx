import { NavLink, useNavigate } from "react-router-dom";
import "./student.css";

/**
 * Reusable Student layout: header + sidebar + main content area.
 *
 * Visual language intentionally mirrors the Faculty module (same gradient
 * header/sidebar, profile block, nav links, logout) so the app feels
 * consistent across modules.
 *
 * Logout has no auth yet — it simply returns to the home/role-selection page.
 */
const STUDENT_NAV = [
  { label: "Dashboard", path: "/student", icon: "📊", end: true },
  { label: "Available Quizzes", path: "/student/quizzes", icon: "📝" },
  { label: "My Results", path: "/student/results", icon: "📈" },
];

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("") || "S"
  );
}

function StudentLayout({ children, student, studentName }) {
  const navigate = useNavigate();

  const displayName = student?.name || studentName || "Student User";
  const subtitle = student?.department || "Student";
  const initials = getInitials(student?.name || studentName);

  const handleLogout = () => {
    // No auth yet — just return to the home / role-selection page.
    navigate("/");
  };

  return (
    <div className="student-layout d-flex flex-column min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-expand-lg student-header shadow-sm px-4">
        <div className="container-fluid">
          <NavLink
            to="/student"
            className="navbar-brand fw-bold text-white d-flex align-items-center gap-2"
          >
            <span className="student-brand-icon">🎓</span>
            Online Quiz System
          </NavLink>
          <span className="text-white-50 d-none d-md-inline small">
            Student Panel
          </span>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside className="student-sidebar d-flex flex-column">
          <div className="student-sidebar-profile text-center py-4 px-3">
            <div
              className="student-avatar mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle bg-white text-primary fw-bold"
              style={{ width: 60, height: 60, fontSize: "1.25rem" }}
            >
              {initials}
            </div>
            <h6 className="mb-0 text-white">{displayName}</h6>
            <small className="text-white-50">{subtitle}</small>
          </div>

          <nav className="flex-grow-1 px-3 py-2">
            <ul className="nav flex-column gap-1">
              {STUDENT_NAV.map((item) => (
                <li className="nav-item" key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `nav-link student-nav-link d-flex align-items-center gap-2 rounded ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    <span className="student-nav-icon">{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-3 pb-4">
            <button
              className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="student-content flex-grow-1 p-4 bg-light">
          {children}
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
