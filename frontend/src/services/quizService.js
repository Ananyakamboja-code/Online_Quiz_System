/**
 * Quiz service (Admin).
 *
 * Encapsulates all quiz-related data access so UI components never talk to
 * the network directly. Today it resolves from mock data; when the backend
 * (http://localhost:8080/api) is ready, swap each body for the commented
 * Axios call — the function signatures and return shapes stay the same.
 */
import { mockQuizzes } from '../data/mockData';
// import api from './api';

// Simulate async so components already handle promises like real API calls.
const resolve = (data) => Promise.resolve(data);

export const getQuizzes = () => {
  // return api.get('/admin/quizzes').then((res) => res.data);
  return resolve(mockQuizzes);
};

export const getQuizById = (id) => {
  // return api.get(`/admin/quizzes/${id}`).then((res) => res.data);
  const quiz = mockQuizzes.find((q) => q.id === Number(id));
  return resolve(quiz || null);
};

export const createQuiz = (payload) => {
  // return api.post('/admin/quizzes', payload).then((res) => res.data);
  const newQuiz = { id: Date.now(), created_at: new Date().toISOString(), ...payload };
  return resolve(newQuiz);
};

export const updateQuiz = (id, payload) => {
  // return api.put(`/admin/quizzes/${id}`, payload).then((res) => res.data);
  return resolve({ id: Number(id), ...payload });
};

export const deleteQuiz = (id) => {
  // return api.delete(`/admin/quizzes/${id}`).then((res) => res.data);
  return resolve({ id: Number(id), deleted: true });
};
