import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_HOME } from '../data/authRoles';

/**
 * Shown when an authenticated user tries to access a route their role is not
 * allowed to see (403-style). Offers a way back to their own dashboard.
 */
export default function Unauthorized() {
  const { role } = useAuth();
  const home = ROLE_HOME[role] || '/';

  return (
    <div className="container py-5">
      <div className="text-center mx-auto" style={{ maxWidth: 480 }}>
        <h1 className="display-6 mb-3">403 — Access Denied</h1>
        <p className="text-muted mb-4">
          You do not have permission to view this page with your current role.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to={home} className="btn btn-primary">
            Go to My Dashboard
          </Link>
          <Link to="/login" className="btn btn-outline-secondary">
            Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
}
