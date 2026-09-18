/**
 * Student module service layer.
 *
 * Keeps all data-access logic out of the UI components. Right now every
 * function returns mock data (wrapped in Promises so components can already
 * use async/await). When the backend is ready, swap the mock bodies for the
 * commented axios calls below - the component code will not need to change.
 */
import api from "./api";
import {
  quizzes,
  questions,
  results,
  currentStudent,
  getQuizById,
  getQuestionsByQuizId,
  getQuestionCount,
  getPercentage,
  computeStudentStats,
} from "../data/studentMockData.js";

// Simulate small network latency so loading states behave realistically.
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/** Get the current student profile (placeholder until auth exists). */
export async function fetchCurrentStudent() {
  await delay();
  return currentStudent;
  // return (await api.get("/students/me")).data;
}

/** Get all available quizzes (with question counts attached for the UI). */
export async function fetchAvailableQuizzes() {
  await delay();
  return quizzes.map((quiz) => ({
    ...quiz,
    questionCount: getQuestionCount(quiz.id),
  }));
  // return (await api.get("/quizzes")).data;
}

/** Get a single quiz's details including its question count. */
export async function fetchQuizById(quizId) {
  await delay();
  const quiz = getQuizById(quizId);
  if (!quiz) return null;
  return { ...quiz, questionCount: getQuestionCount(quiz.id) };
  // return (await api.get(`/quizzes/${quizId}`)).data;
}

/** Get all questions for a quiz. */
export async function fetchQuizQuestions(quizId) {
  await delay();
  return getQuestionsByQuizId(quizId);
  // return (await api.get(`/quizzes/${quizId}/questions`)).data;
}

/**
 * Submit a quiz attempt.
 *
 * Frontend-only mock scoring: compares selected answers against the mock
 * correct_answer values. In the real system the backend computes the score
 * and correct answers are never exposed to the client.
 *
 * @param {number} quizId
 * @param {Object<number,string>} answers map of questionId -> "A"|"B"|"C"|"D"
 */
export async function submitQuizAttempt(quizId, answers) {
  await delay();
  const quizQuestions = getQuestionsByQuizId(quizId);
  let score = 0;

  const breakdown = quizQuestions.map((q) => {
    const selected = answers[q.id] || null;
    const isCorrect = selected === q.correct_answer;
    if (isCorrect) score += 1;
    return {
      questionId: q.id,
      questionText: q.question_text,
      selected,
      correct: q.correct_answer,
      isCorrect,
    };
  });

  const total = quizQuestions.length;
  const answeredCount = quizQuestions.filter((q) => answers[q.id]).length;
  return {
    quiz_id: Number(quizId),
    student_id: currentStudent.id,
    score,
    total_questions: total,
    correct: score,
    incorrect: total - score,
    unanswered: total - answeredCount,
    percentage: total > 0 ? Math.round((score / total) * 100) : 0,
    submitted_at: new Date().toISOString(),
    breakdown,
  };
  // return (await api.post(`/quizzes/${quizId}/submit`, { answers })).data;
}

/**
 * Get the current student's past results, enriched with quiz title, percentage,
 * and correct/incorrect counts for the results table.
 */
export async function fetchResultsHistory() {
  await delay();
  return results.map((r) => {
    const quiz = getQuizById(r.quiz_id);
    return {
      ...r,
      quizTitle: quiz ? quiz.title : "Unknown Quiz",
      correct: r.score,
      incorrect: r.total_questions - r.score,
      percentage: getPercentage(r.score, r.total_questions),
    };
  });
  // return (await api.get("/students/me/results")).data;
}

/**
 * Get aggregate statistics for the current student, derived from mock results.
 * Kept in the service layer so components stay presentation-only.
 */
export async function fetchStudentStats() {
  await delay();
  return computeStudentStats(results);
  // return (await api.get("/students/me/stats")).data;
}
