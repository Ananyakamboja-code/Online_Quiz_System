import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard for role-based access control (RBAC).
 *
 * Usage (wrap a single element):
 *   <ProtectedRoute allowedRoles={['ADMIN']}>
 *     <AdminRoutes />
 *   </ProtectedRoute>
 *
 * Or as a layout route (renders <Outlet />):
 *   <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
 *     <Route path="/admin/*" element={<AdminRoutes />} />
 *   </Route>
 *
 * Behavior:
 * - Not authenticated  -> redirect to /login (remembering where they came from)
 * - Authenticated but role not allowed -> redirect to /unauthorized
 * - Otherwise render the protected content
 *
 * IMPORTANT: this is a frontend UX guard, not real security. The backend
 * (Spring Security) is the real enforcement point once it exists.
 */
export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { isAuthenticated, role, bootstrapping } = useAuth();
  const location = useLocation();

  // While validating an existing token on load, don't redirect yet.
  if (bootstrapping) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Support both wrapper usage (children) and layout-route usage (Outlet).
  return children ? children : <Outlet />;
}
