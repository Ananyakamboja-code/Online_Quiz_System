import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Faculty-specific sidebar with navigation links.
 * Highlights the active route and includes a logout placeholder.
 */
const FACULTY_NAV = [
  { label: 'Dashboard',       path: '/faculty/dashboard',   icon: '📊' },
  { label: 'Create Quiz',     path: '/faculty/create-quiz',  icon: '➕' },
  { label: 'My Quizzes',      path: '/faculty/my-quizzes',   icon: '📝' },
  { label: 'Questions',       path: '/faculty/questions',     icon: '❓' },
  { label: 'Student Results', path: '/faculty/results',       icon: '📈' },
  { label: 'Profile',         path: '/faculty/profile',       icon: '👤' },
];

export default function FacultySidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    /* Common auth: clear session and return to login */
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="faculty-sidebar d-flex flex-column">
      <div className="faculty-sidebar-profile text-center py-4 px-3">
        <div className="faculty-avatar mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle bg-white text-primary fw-bold"
             style={{ width: 60, height: 60, fontSize: '1.25rem' }}>
          FU
        </div>
        <h6 className="mb-0 text-white">Faculty User</h6>
        <small className="text-white-50">Computer Science</small>
      </div>

      <nav className="flex-grow-1 px-3 py-2">
        <ul className="nav flex-column gap-1">
          {FACULTY_NAV.map((item) => (
            <li className="nav-item" key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link faculty-nav-link d-flex align-items-center gap-2 rounded ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <span className="faculty-nav-icon">{item.icon}</span>
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
  );
}
