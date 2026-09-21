import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Admin top navigation bar.
 *
 * Logout uses the common auth layer: it clears the session and returns the
 * user to the login page.
 */
export default function AdminNavbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-dark admin-navbar px-3">
      <div className="container-fluid">
        <Link className="navbar-brand mb-0 h1 fs-5" to="/admin">
          Quiz Admin
        </Link>
        <div className="d-flex align-items-center gap-3">
          <span className="navbar-text text-white-50 small">
            {user?.name || 'Administrator'}
          </span>
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
