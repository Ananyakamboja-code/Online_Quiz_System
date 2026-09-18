/**
 * In-memory session store for quizzes.
 *
 * WHY: there is no backend and no global state library yet, but the Admin UI
 * needs create/edit/delete to feel real across page navigation during a
 * session. This module holds a mutable copy of the mock quizzes so the UI can
 * be exercised end to end. It resets on page refresh — expected for now.
 *
 * Admin manages quiz-level data only. Questions are owned by the Faculty
 * module, so no question CRUD lives here.
 *
 * REPLACE LATER: swap these functions for the Axios-backed quizService.
 */
import { mockQuizzes } from './mockData';

// Clone so we never mutate the original mock array.
let quizzes = mockQuizzes.map((q) => ({ ...q }));

let quizSeq = Math.max(0, ...quizzes.map((q) => q.id)) + 1;

export const listQuizzes = () => quizzes.map((q) => ({ ...q }));

export const findQuiz = (id) => {
  const quiz = quizzes.find((q) => q.id === Number(id));
  return quiz ? { ...quiz } : null;
};

export const addQuiz = ({ title, description, duration, facultyId, facultyName }) => {
  const quiz = {
    id: quizSeq++,
    title,
    description,
    duration,
    facultyId,
    facultyName,
    createdAt: new Date().toISOString(),
  };
  quizzes.push(quiz);
  return { ...quiz };
};

export const editQuiz = (id, { title, description, duration, facultyId, facultyName }) => {
  quizzes = quizzes.map((q) =>
    q.id === Number(id)
      ? { ...q, title, description, duration, facultyId, facultyName }
      : q
  );
  return findQuiz(id);
};

export const removeQuiz = (id) => {
  quizzes = quizzes.filter((q) => q.id !== Number(id));
};

// Count how many quizzes a given faculty has created (for Faculty Details).
export const countQuizzesByFaculty = (facultyId) =>
  quizzes.filter((q) => q.facultyId === facultyId).length;
