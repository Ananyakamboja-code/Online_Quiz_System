/**
 * Mock data for the Admin UI.
 *
 * The backend does not exist yet, so the Admin pages read from here to render
 * realistic content. Shapes match the planned DB entities so this file can be
 * swapped for real Axios calls later with minimal UI changes.
 *
 * Entities: faculty, users, quizzes, questions, results.
 *
 * NOTE on responsibilities: the Admin module views/manages quizzes, faculty,
 * and results only. Questions belong to the Faculty module and are NOT managed
 * from Admin. `mockQuestions` is kept purely so Results can show a realistic
 * "total questions" per quiz — Admin never edits questions.
 */

// --- faculty ----------------------------------------------------------------
// Faculty who own/create quizzes. Admin can view these details.
export const mockFaculty = [
  { id: 'F001', name: 'Priya Sharma', email: 'priya@example.com', status: 'Active' },
  { id: 'F002', name: 'Rahul Kumar', email: 'rahul@example.com', status: 'Active' },
  { id: 'F003', name: 'Anita Desai', email: 'anita@example.com', status: 'Inactive' },
];

// --- users ------------------------------------------------------------------
// General user list (used for student names in results).
export const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'ADMIN' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'FACULTY' },
  { id: 3, name: 'Rahul Kumar', email: 'rahul@example.com', role: 'FACULTY' },
  { id: 4, name: 'David Lee', email: 'david@example.com', role: 'STUDENT' },
  { id: 5, name: 'Emma Davis', email: 'emma@example.com', role: 'STUDENT' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'STUDENT' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', role: 'STUDENT' },
  { id: 8, name: 'Henry Ford', email: 'henry@example.com', role: 'STUDENT' },
];

// --- quizzes ----------------------------------------------------------------
// Each quiz references the faculty member who created it.
export const mockQuizzes = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    description: 'Core JS concepts: variables, types, functions, scope.',
    duration: 30,
    facultyId: 'F001',
    facultyName: 'Priya Sharma',
    createdAt: '2026-09-18T10:00:00Z',
  },
  {
    id: 2,
    title: 'React Basics',
    description: 'Components, props, state, and hooks.',
    duration: 45,
    facultyId: 'F002',
    facultyName: 'Rahul Kumar',
    createdAt: '2026-09-18T09:30:00Z',
  },
  {
    id: 3,
    title: 'HTML & CSS Essentials',
    description: 'Semantic HTML and modern CSS layout.',
    duration: 20,
    facultyId: 'F001',
    facultyName: 'Priya Sharma',
    createdAt: '2026-08-15T14:15:00Z',
  },
  {
    id: 4,
    title: 'Databases & SQL',
    description: 'Relational modeling and basic SQL queries.',
    duration: 40,
    facultyId: 'F002',
    facultyName: 'Rahul Kumar',
    createdAt: '2026-09-01T11:00:00Z',
  },
];

// --- questions --------------------------------------------------------------
// Owned by the Faculty module. Present here only so Admin Results can compute
// a realistic total-questions figure. Admin does NOT manage these.
export const mockQuestions = [
  { id: 1, quiz_id: 1 },
  { id: 2, quiz_id: 1 },
  { id: 3, quiz_id: 2 },
  { id: 4, quiz_id: 2 },
  { id: 5, quiz_id: 4 },
];

// --- results ----------------------------------------------------------------
export const mockResults = [
  {
    id: 1,
    quiz_id: 1,
    student_id: 4,
    score: 8,
    total_questions: 10,
    submitted_at: '2026-09-05T13:20:00Z',
  },
  {
    id: 2,
    quiz_id: 1,
    student_id: 5,
    score: 6,
    total_questions: 10,
    submitted_at: '2026-09-05T13:45:00Z',
  },
  {
    id: 3,
    quiz_id: 2,
    student_id: 6,
    score: 9,
    total_questions: 10,
    submitted_at: '2026-09-06T10:10:00Z',
  },
  {
    id: 4,
    quiz_id: 2,
    student_id: 4,
    score: 7,
    total_questions: 10,
    submitted_at: '2026-09-06T10:35:00Z',
  },
  {
    id: 5,
    quiz_id: 4,
    student_id: 7,
    score: 5,
    total_questions: 10,
    submitted_at: '2026-09-10T15:00:00Z',
  },
];

// --- display helpers --------------------------------------------------------
// Kept here so the UI does not hardcode lookup logic.
export function getUserName(userId) {
  const user = mockUsers.find((u) => u.id === userId);
  return user ? user.name : `User #${userId}`;
}

export function getQuizTitle(quizId) {
  const quiz = mockQuizzes.find((q) => q.id === quizId);
  return quiz ? quiz.title : `Quiz #${quizId}`;
}

export function getQuizFacultyName(quizId) {
  const quiz = mockQuizzes.find((q) => q.id === quizId);
  return quiz ? quiz.facultyName : '—';
}
