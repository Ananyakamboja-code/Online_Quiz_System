import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import Unauthorized from '../pages/Unauthorized';
import AdminRoutes from './AdminRoutes';
import StudentPage from '../pages/student/StudentPage';
import FacultyPage from '../pages/faculty/FacultyPage';
import ProtectedRoute from './ProtectedRoute';
import RegisterPage from '../pages/RegisterPage';
import { ROLES } from '../data/authRoles';

/**
 * Central route table with common authentication + RBAC.
 *
 * Root "/" opens the login page directly. Public routes: login, register,
 * unauthorized. Each module branch is wrapped in <ProtectedRoute> with the
 * roles allowed to access it, so unauthenticated users go to /login and
 * wrong-role users go to /unauthorized. The guard is frontend UX only — the
 * backend is the real enforcement point.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Root opens the login page directly */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin module (ADMIN only) */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* Student module (STUDENT only) */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentPage />
          </ProtectedRoute>
        }
      />

      {/* Faculty module (FACULTY only) */}
      <Route
        path="/faculty/*"
        element={
          <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
            <FacultyPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
