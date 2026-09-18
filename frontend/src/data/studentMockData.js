/**
 * Mock data for the Student frontend module.
 *
 * Shapes mirror the backend database entities so that swapping mock data
 * for real API responses later requires minimal changes:
 *   quizzes:   id, title, description, duration, created_by, created_at
 *   questions: id, quiz_id, question_text, option_a..d, correct_answer
 *   results:   id, quiz_id, student_id, score, total_questions, submitted_at
 *
 * NOTE: correct_answer is included here only so the frontend can compute a
 * mock score. In the real system, scoring happens on the backend and the
 * correct answers would NOT be sent to the student client.
 */

// The currently "logged in" student (placeholder until auth exists).
// Extra profile fields below are mock-only and are NOT part of the backend
// `users` schema. They live here so the Student Portal UI can show a realistic
// profile. When auth is added later, these can be sourced from the profile API.
export const currentStudent = {
  id: 101,
  name: "Ananya Kamboj",
  email: "student@example.com",
  role: "STUDENT",
  studentId: "STU2026001",
  department: "Electronics and Communication Engineering",
  program: "B.Tech",
  year: "3rd Year",
  semester: "5th Semester",
};

export const quizzes = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description:
      "Test your knowledge of core JavaScript concepts including variables, functions, scope, and data types.",
    duration: 10, // minutes
    difficulty: "Easy", // mock-only UI field, not a DB column
    created_by: 5,
    created_at: "2026-09-01T10:00:00Z",
  },
  {
    id: 2,
    title: "React Basics",
    description:
      "Components, props, state, and hooks. A quick check on your foundational React understanding.",
    duration: 15,
    difficulty: "Medium",
    created_by: 5,
    created_at: "2026-09-05T09:30:00Z",
  },
  {
    id: 3,
    title: "Data Structures",
    description:
      "Arrays, linked lists, stacks, queues, and time complexity essentials.",
    duration: 20,
    difficulty: "Hard",
    created_by: 7,
    created_at: "2026-09-08T14:15:00Z",
  },
  {
    id: 4,
    title: "SQL & Databases",
    description:
      "Relational database concepts, joins, and basic query writing.",
    duration: 12,
    difficulty: "Medium",
    created_by: 7,
    created_at: "2026-09-10T11:45:00Z",
  },
];

export const questions = [
  // Quiz 1 - JavaScript Fundamentals
  {
    id: 1,
    quiz_id: 1,
    question_text: "Which keyword declares a block-scoped variable in JavaScript?",
    option_a: "var",
    option_b: "let",
    option_c: "function",
    option_d: "static",
    correct_answer: "B",
  },
  {
    id: 2,
    quiz_id: 1,
    question_text: "What is the result of typeof null?",
    option_a: "\"null\"",
    option_b: "\"undefined\"",
    option_c: "\"object\"",
    option_d: "\"number\"",
    correct_answer: "C",
  },
  {
    id: 3,
    quiz_id: 1,
    question_text: "Which method converts a JSON string into a JavaScript object?",
    option_a: "JSON.stringify()",
    option_b: "JSON.parse()",
    option_c: "JSON.object()",
    option_d: "JSON.toObject()",
    correct_answer: "B",
  },
  {
    id: 4,
    quiz_id: 1,
    question_text: "What does the === operator check?",
    option_a: "Value only",
    option_b: "Type only",
    option_c: "Value and type",
    option_d: "Reference only",
    correct_answer: "C",
  },

  // Quiz 2 - React Basics
  {
    id: 5,
    quiz_id: 2,
    question_text: "What hook is used to add state to a functional component?",
    option_a: "useEffect",
    option_b: "useState",
    option_c: "useRef",
    option_d: "useContext",
    correct_answer: "B",
  },
  {
    id: 6,
    quiz_id: 2,
    question_text: "How are data passed from a parent to a child component?",
    option_a: "State",
    option_b: "Context only",
    option_c: "Props",
    option_d: "Refs",
    correct_answer: "C",
  },
  {
    id: 7,
    quiz_id: 2,
    question_text: "Which hook runs side effects after render?",
    option_a: "useState",
    option_b: "useMemo",
    option_c: "useEffect",
    option_d: "useReducer",
    correct_answer: "C",
  },

  // Quiz 3 - Data Structures
  {
    id: 8,
    quiz_id: 3,
    question_text: "Which data structure uses LIFO ordering?",
    option_a: "Queue",
    option_b: "Stack",
    option_c: "Array",
    option_d: "Tree",
    correct_answer: "B",
  },
  {
    id: 9,
    quiz_id: 3,
    question_text: "What is the average time complexity of accessing an array element by index?",
    option_a: "O(1)",
    option_b: "O(n)",
    option_c: "O(log n)",
    option_d: "O(n^2)",
    correct_answer: "A",
  },
  {
    id: 10,
    quiz_id: 3,
    question_text: "Which structure follows FIFO ordering?",
    option_a: "Stack",
    option_b: "Queue",
    option_c: "Hash map",
    option_d: "Binary tree",
    correct_answer: "B",
  },

  // Quiz 4 - SQL & Databases
  {
    id: 11,
    quiz_id: 4,
    question_text: "Which SQL clause is used to filter rows?",
    option_a: "ORDER BY",
    option_b: "GROUP BY",
    option_c: "WHERE",
    option_d: "HAVING",
    correct_answer: "C",
  },
  {
    id: 12,
    quiz_id: 4,
    question_text: "Which JOIN returns only matching rows from both tables?",
    option_a: "LEFT JOIN",
    option_b: "RIGHT JOIN",
    option_c: "FULL OUTER JOIN",
    option_d: "INNER JOIN",
    correct_answer: "D",
  },
];

export const results = [
  {
    id: 1,
    quiz_id: 1,
    student_id: 101,
    score: 3,
    total_questions: 4,
    submitted_at: "2026-09-12T16:20:00Z",
  },
  {
    id: 2,
    quiz_id: 2,
    student_id: 101,
    score: 2,
    total_questions: 3,
    submitted_at: "2026-09-14T10:05:00Z",
  },
  {
    id: 3,
    quiz_id: 4,
    student_id: 101,
    score: 2,
    total_questions: 2,
    submitted_at: "2026-09-16T13:40:00Z",
  },
  {
    id: 4,
    quiz_id: 1,
    student_id: 101,
    score: 4,
    total_questions: 4,
    submitted_at: "2026-09-17T09:15:00Z",
  },
  {
    id: 5,
    quiz_id: 3,
    student_id: 101,
    score: 1,
    total_questions: 3,
    submitted_at: "2026-09-18T11:30:00Z",
  },
];

/** Helper: number of questions for a given quiz. */
export const getQuestionCount = (quizId) =>
  questions.filter((q) => q.quiz_id === quizId).length;

/** Helper: fetch a single quiz by id. */
export const getQuizById = (quizId) =>
  quizzes.find((q) => q.id === Number(quizId));

/** Helper: fetch all questions for a quiz. */
export const getQuestionsByQuizId = (quizId) =>
  questions.filter((q) => q.quiz_id === Number(quizId));

/** Helper: percentage for a single result record. */
export const getPercentage = (score, total) =>
  total > 0 ? Math.round((score / total) * 100) : 0;

/**
 * Compute aggregate student statistics from the mock results.
 * Everything here is derived (never hardcoded) so the dashboard and results
 * summary stay in sync with the underlying data.
 */
export const computeStudentStats = (resultList = results) => {
  const attempts = resultList.length;
  // "Attempted" = distinct quizzes the student has started/submitted.
  const attemptedQuizIds = new Set(resultList.map((r) => r.quiz_id));
  const totalQuestionsAnswered = resultList.reduce(
    (sum, r) => sum + r.total_questions,
    0
  );
  const totalCorrect = resultList.reduce((sum, r) => sum + r.score, 0);
  const totalIncorrect = totalQuestionsAnswered - totalCorrect;
  const percentages = resultList.map((r) =>
    getPercentage(r.score, r.total_questions)
  );
  const averagePercentage = percentages.length
    ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
    : 0;
  const highestPercentage = percentages.length ? Math.max(...percentages) : 0;

  return {
    totalQuizzes: quizzes.length,
    attempted: attemptedQuizIds.size,
    completed: attempts, // each result represents a completed attempt
    totalAttempts: attempts,
    averagePercentage,
    highestPercentage,
    totalQuestionsAnswered,
    totalCorrect,
    totalIncorrect,
  };
};
