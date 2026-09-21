import { NavLink, useNavigate } from 'react-router-dom';
import { ADMIN_NAV_ITEMS } from './adminNavConfig';
import { useAuth } from '../../context/AuthContext';

/**
 * Admin sidebar navigation.
 *
 * Links: Dashboard, Quiz Management, Faculty Details, Results, and Logout.
 * Logout uses the common auth layer: it clears the session and returns the
 * user to the login page.
 */
export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="admin-sidebar d-flex flex-column p-3">
      <h6 className="text-uppercase text-white-50 mb-3">Admin Menu</h6>
      <ul className="nav flex-column flex-grow-1">
        {ADMIN_NAV_ITEMS.map((item) => (
          <li className="nav-item" key={item.path}>
            <NavLink
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `nav-link admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn-outline-light btn-sm mt-3"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
}
