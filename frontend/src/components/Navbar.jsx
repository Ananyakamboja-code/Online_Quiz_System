import { Link } from 'react-router-dom';

/**
 * Shared top navigation bar.
 *
 * Kept intentionally simple for now. Once JWT auth exists, this can show the
 * logged-in user and a login/logout control.
 */
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Online Quiz System
        </Link>
        <span className="navbar-text text-white-50">
          Common Frontend Foundation
        </span>
      </div>
    </nav>
  );
}
