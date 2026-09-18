/**
 * Central navigation config.
 *
 * Each entry declares which role it belongs to so the shared Sidebar/Navbar
 * can later filter links by the logged-in user's role (role-based access
 * control). No auth exists yet, so for now every link is simply shown.
 */
export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  FACULTY: 'faculty',
};

export const NAV_ITEMS = [
  { label: 'Admin', path: '/admin', role: ROLES.ADMIN },
  { label: 'Student', path: '/student', role: ROLES.STUDENT },
  { label: 'Faculty', path: '/faculty', role: ROLES.FACULTY },
];

/**
 * Returns nav items visible for a given role.
 * When `role` is null/undefined (current state: no auth) all items are returned.
 */
export function getNavItemsForRole(role) {
  if (!role) return NAV_ITEMS;
  return NAV_ITEMS.filter((item) => item.role === role);
}
