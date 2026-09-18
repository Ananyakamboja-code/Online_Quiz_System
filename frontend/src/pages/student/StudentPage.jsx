import StudentRoutes from "../../routes/StudentRoutes.jsx";

/**
 * Student module entry page.
 *
 * Mounted under "/student/*" in the shared AppRoutes. Renders the Student
 * module's own nested routes (dashboard, quizzes, take quiz, results...).
 *
 * The Student module uses its own StudentLayout (navbar + sidebar), so we do
 * NOT wrap it in the shared AppLayout here to avoid a duplicated shell.
 * Owned by the Student developer.
 */
export default function StudentPage() {
  return <StudentRoutes />;
}
