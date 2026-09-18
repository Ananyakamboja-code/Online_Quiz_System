import { NavLink } from 'react-router-dom';
import { getNavItemsForRole } from './navConfig';

/**
 * Shared sidebar with role-aware navigation.
 *
 * `role` is optional. With no role (current state, no auth) all links show.
 * Later, pass the authenticated user's role to filter the menu.
 */
export default function Sidebar({ role = null }) {
  const items = getNavItemsForRole(role);

  return (
    <aside className="app-sidebar bg-light border-end p-3">
      <h6 className="text-uppercase text-muted mb-3">Navigation</h6>
      <ul className="nav flex-column">
        {items.map((item) => (
          <li className="nav-item" key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active fw-bold' : ''}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
