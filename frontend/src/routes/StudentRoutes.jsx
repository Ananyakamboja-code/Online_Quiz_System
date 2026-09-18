import { Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "../pages/student/StudentDashboard.jsx";
import AvailableQuizzes from "../pages/student/AvailableQuizzes.jsx";
import QuizDetails from "../pages/student/QuizDetails.jsx";
import TakeQuiz from "../pages/student/TakeQuiz.jsx";
import QuizResult from "../pages/student/QuizResult.jsx";
import ResultsHistory from "../pages/student/ResultsHistory.jsx";

/**
 * Student module routes. Mounted under "/student/*" in App.jsx, so paths here
 * are relative to /student.
 *
 * Full paths:
 *   /student                        -> Dashboard
 *   /student/quizzes                -> Available quizzes
 *   /student/quizzes/:id            -> Quiz details / start
 *   /student/quizzes/:id/start      -> Take quiz
 *   /student/quizzes/:id/result     -> Quiz result
 *   /student/results                -> Results history
 *
 * Authentication/authorization is intentionally NOT applied yet. The common
 * auth module can later wrap this route group (or App's <Route path="/student/*">)
 * with a protected-route guard.
 */
function StudentRoutes() {
  return (
    <Routes>
      <Route index element={<StudentDashboard />} />
      <Route path="quizzes" element={<AvailableQuizzes />} />
      <Route path="quizzes/:id" element={<QuizDetails />} />
      <Route path="quizzes/:id/start" element={<TakeQuiz />} />
      <Route path="quizzes/:id/result" element={<QuizResult />} />
      <Route path="results" element={<ResultsHistory />} />
      <Route path="*" element={<Navigate to="/student" replace />} />
    </Routes>
  );
}

export default StudentRoutes;
