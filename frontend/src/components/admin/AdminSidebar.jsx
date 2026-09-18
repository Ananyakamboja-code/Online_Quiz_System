import { NavLink } from 'react-router-dom';
import { ADMIN_NAV_ITEMS } from './adminNavConfig';

/**
 * Admin sidebar navigation.
 *
 * Links: Dashboard, Quiz Management, Results, and a Logout placeholder.
 * Logout is intentionally non-functional until the shared auth layer exists.
 */
export default function AdminSidebar() {
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

      {/* Logout placeholder — no auth implemented yet. */}
      <button
        type="button"
        className="btn btn-outline-light btn-sm mt-3"
        title="Logout (not implemented yet)"
        disabled
      >
        Logout
      </button>
    </aside>
  );
}
