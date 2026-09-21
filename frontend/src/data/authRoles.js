/**
 * Shared role constants for the frontend auth layer.
 *
 * These mirror the backend's roles (STUDENT / FACULTY / ADMIN). The backend is
 * the source of truth and the real enforcement point; these constants are used
 * for routing, the register role picker, and post-login redirects.
 */
export const ROLES = {
  STUDENT: 'STUDENT',
  FACULTY: 'FACULTY',
  ADMIN: 'ADMIN',
};

// Where each role lands after login.
export const ROLE_HOME = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.FACULTY]: '/faculty',
  [ROLES.STUDENT]: '/student',
};

// For the role selection UI (labels + descriptions).
export const ROLE_OPTIONS = [
  { value: ROLES.STUDENT, label: 'Student', description: 'Take quizzes and view your results' },
  { value: ROLES.FACULTY, label: 'Faculty', description: 'Create quizzes and manage questions' },
  { value: ROLES.ADMIN, label: 'Admin', description: 'Manage quizzes, faculty, and results' },
];
