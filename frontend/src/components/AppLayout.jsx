import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Reusable page shell: Navbar on top, Sidebar on the left, content on the right.
 *
 * All feature pages render inside `children`. This is the single place to
 * evolve the shared chrome (e.g. role-based nav) without touching page code.
 */
export default function AppLayout({ children, role = null }) {
  return (
    <div className="app-shell d-flex flex-column">
      <Navbar />
      <div className="d-flex flex-grow-1">
        <Sidebar role={role} />
        <main className="app-content p-4">{children}</main>
      </div>
    </div>
  );
}
