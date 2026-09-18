import { Routes, Route, Navigate } from 'react-router-dom';

/* Faculty CSS — imported once, scoped via .faculty-* class names */
import './faculty.css';

/* Faculty pages */
import FacultyDashboard from './FacultyDashboard';
import CreateQuiz from './CreateQuiz';
import MyQuizzes from './MyQuizzes';
import Questions from './Questions';
import StudentResults from './StudentResults';
import FacultyProfile from './FacultyProfile';

/**
 * Faculty module entry point.
 * Handles all /faculty/* sub-routes internally so the shared AppRoutes file
 * only needs a single <Route path="/faculty/*" /> entry.
 */
export default function FacultyPage() {
  return (
    <Routes>
      <Route path="dashboard" element={<FacultyDashboard />} />
      <Route path="create-quiz" element={<CreateQuiz />} />
      <Route path="my-quizzes" element={<MyQuizzes />} />
      <Route path="questions" element={<Questions />} />
      <Route path="results" element={<StudentResults />} />
      <Route path="profile" element={<FacultyProfile />} />
      {/* Default: redirect /faculty to /faculty/dashboard */}
      <Route path="" element={<Navigate to="dashboard" replace />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
