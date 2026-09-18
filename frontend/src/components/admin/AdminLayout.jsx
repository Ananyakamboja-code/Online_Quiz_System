import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import './admin.css';

/**
 * Reusable Admin layout: fixed sidebar + top navbar + main content area.
 *
 * Used as the element for the /admin route so every nested admin page renders
 * inside <Outlet /> with consistent chrome. This is Admin-specific and does
 * not touch the shared AppLayout used by other modules.
 *
 * NOTE: This layout is structured so a common ProtectedRoute/role guard can
 * later wrap the /admin route without changing any page code.
 */
export default function AdminLayout() {
  return (
    <div className="admin-shell d-flex">
      <AdminSidebar />
      <div className="admin-main d-flex flex-column flex-grow-1">
        <AdminNavbar />
        <main className="admin-content p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
