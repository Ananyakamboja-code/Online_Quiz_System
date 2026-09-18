import { Link, useNavigate } from 'react-router-dom';

/**
 * Admin top navigation bar.
 *
 * The "Logout" control does a frontend-only redirect to home for now (no auth
 * yet), matching the Student and Faculty modules. Real logout will hook into
 * the shared auth layer once it exists.
 */
export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    /* No auth — just redirect to home */
    navigate('/');
  };

  return (
    <nav className="navbar navbar-dark admin-navbar px-3">
      <div className="container-fluid">
        <Link className="navbar-brand mb-0 h1 fs-5" to="/admin">
          Quiz Admin
        </Link>
        <div className="d-flex align-items-center gap-3">
          <span className="navbar-text text-white-50 small">Administrator</span>
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
