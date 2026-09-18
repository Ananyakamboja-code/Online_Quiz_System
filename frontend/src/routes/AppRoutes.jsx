import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import AdminRoutes from './AdminRoutes';
import StudentPage from '../pages/student/StudentPage';
import FacultyPage from '../pages/faculty/FacultyPage';

/**
 * Central route table.
 *
 * Each module has its own top-level route so the three developers can add
 * nested routes under their own path without touching each other's code
 * (e.g. Admin adds <Route path="/admin/quizzes" .../> here or via nesting).
 *
 * Role-based guards (ProtectedRoute) will wrap these routes once JWT auth
 * is implemented. Not added yet by design.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Admin module — nested routes live in AdminRoutes. A shared
          ProtectedRoute can later wrap this /admin/* branch for RBAC. */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Student module — wildcard enables nested sub-routes inside StudentPage */}
      <Route path="/student/*" element={<StudentPage />} />

      {/* Faculty module — wildcard enables nested sub-routes inside FacultyPage */}
      <Route path="/faculty/*" element={<FacultyPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
