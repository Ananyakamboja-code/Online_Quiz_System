/**
 * Quiz service (Admin) — real API.
 *
 * Talks to the backend at /api/admin/quizzes via the shared Axios instance
 * (baseURL http://localhost:8080/api, token attached by the interceptor).
 * Responses already include facultyName, questionCount, and createdAt.
 */
import api from './api';

export const getQuizzes = () =>
  api.get('/admin/quizzes').then((res) => res.data);

export const getQuizById = (id) =>
  api.get(`/admin/quizzes/${id}`).then((res) => res.data);

export const createQuiz = (payload) =>
  api.post('/admin/quizzes', payload).then((res) => res.data);

export const updateQuiz = (id, payload) =>
  api.put(`/admin/quizzes/${id}`, payload).then((res) => res.data);

export const deleteQuiz = (id) =>
  api.delete(`/admin/quizzes/${id}`).then((res) => res.data);
