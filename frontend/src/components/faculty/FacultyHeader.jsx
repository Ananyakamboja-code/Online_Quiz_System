import { Link } from 'react-router-dom';

/**
 * Top header bar for the Faculty module.
 * Shows branding and panel label only — avatar is in the sidebar.
 */
export default function FacultyHeader() {
  return (
    <nav className="navbar navbar-expand-lg faculty-header shadow-sm px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white d-flex align-items-center gap-2" to="/faculty/dashboard">
          <span className="faculty-brand-icon">🎓</span>
          Online Quiz System
        </Link>

        <span className="text-white-50 d-none d-md-inline small">Faculty Panel</span>
      </div>
    </nav>
  );
}
