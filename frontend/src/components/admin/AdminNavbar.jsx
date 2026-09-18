import { Link } from 'react-router-dom';

/**
 * Admin top navigation bar.
 *
 * The "Logout" control is a placeholder only — authentication/JWT is a future
 * common team feature, so this button does not perform any auth action yet.
 */
export default function AdminNavbar() {
  return (
    <nav className="navbar navbar-dark admin-navbar px-3">
      <div className="container-fluid">
        <Link className="navbar-brand mb-0 h1 fs-5" to="/admin">
          Quiz Admin
        </Link>
        <div className="d-flex align-items-center gap-3">
          <span className="navbar-text text-white-50 small">Administrator</span>
          {/* Placeholder only. Real logout comes with the shared auth layer. */}
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            title="Logout (not implemented yet)"
            disabled
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
