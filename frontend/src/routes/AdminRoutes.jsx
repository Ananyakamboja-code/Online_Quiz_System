import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import QuizManagement from '../pages/admin/QuizManagement';
import CreateQuiz from '../pages/admin/CreateQuiz';
import EditQuiz from '../pages/admin/EditQuiz';
import QuizDetails from '../pages/admin/QuizDetails';
import FacultyDetails from '../pages/admin/FacultyDetails';
import Results from '../pages/admin/Results';

/**
 * Admin route table (mounted under /admin/* by AppRoutes).
 *
 * Kept in its own file so the Admin developer owns admin routing without
 * touching shared route config. Paths are relative to /admin.
 *
 * Admin manages quiz-level data, faculty, and results only. There is NO
 * question management route — questions belong to the Faculty module.
 *
 * PROTECTION-READY: to add role-based access later, wrap this whole element
 * (or the AdminLayout route) in a shared <ProtectedRoute role="ADMIN"> in
 * AppRoutes — no changes needed to the pages below.
 *
 *   /admin                       -> Dashboard
 *   /admin/quizzes               -> Quiz Management
 *   /admin/quizzes/create        -> Create Quiz
 *   /admin/quizzes/edit/:id      -> Edit Quiz
 *   /admin/quizzes/:id           -> Quiz Details (read-only)
 *   /admin/faculty               -> Faculty Details
 *   /admin/results               -> Results
 */
export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />

        {/* Quizzes. Static segments (create/edit) are ranked above the
            dynamic :id by React Router, so ordering here is safe. */}
        <Route path="quizzes" element={<QuizManagement />} />
        <Route path="quizzes/create" element={<CreateQuiz />} />
        <Route path="quizzes/edit/:id" element={<EditQuiz />} />
        <Route path="quizzes/:id" element={<QuizDetails />} />

        <Route path="faculty" element={<FacultyDetails />} />
        <Route path="results" element={<Results />} />

        {/* Unknown admin path -> admin dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
