/**
 * Admin sidebar navigation config.
 *
 * Kept separate from the shared top-level navConfig so the Admin developer can
 * evolve admin navigation without touching shared files. `end` marks links
 * that should only be active on an exact path match (e.g. Dashboard at /admin).
 */
export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', end: true },
  { label: 'Quiz Management', path: '/admin/quizzes', end: false },
  { label: 'Faculty Details', path: '/admin/faculty', end: false },
  { label: 'Results', path: '/admin/results', end: false },
];
