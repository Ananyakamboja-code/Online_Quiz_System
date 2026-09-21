import api from './api';

/**
 * Faculty API service.
 * All calls go through the shared Axios instance (auto-attaches JWT token).
 * Every function returns the response data or throws with a readable message.
 */

function toError(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export async function getDashboardStats() {
  try {
    const { data } = await api.get('/faculty/dashboard/stats');
    return data;
  } catch (err) { throw new Error(toError(err, 'Failed to load dashboard.')); }
}

// ── Quizzes ──────────────────────────────────────────────────────────────────
export async function createQuiz(payload) {
  try {
    const { data } = await api.post('/faculty/quizzes', payload);
    return data.quiz;
  } catch (err) { throw new Error(toError(err, 'Failed to create quiz.')); }
}

export async function getMyQuizzes() {
  try {
    const { data } = await api.get('/faculty/quizzes');
    return data.quizzes;
  } catch (err) { throw new Error(toError(err, 'Failed to load quizzes.')); }
}

export async function getQuizById(id) {
  try {
    const { data } = await api.get(`/faculty/quizzes/${id}`);
    return data.quiz;
  } catch (err) { throw new Error(toError(err, 'Failed to load quiz.')); }
}

export async function updateQuiz(id, payload) {
  try {
    const { data } = await api.put(`/faculty/quizzes/${id}`, payload);
    return data.quiz;
  } catch (err) { throw new Error(toError(err, 'Failed to update quiz.')); }
}

export async function deleteQuiz(id) {
  try {
    const { data } = await api.delete(`/faculty/quizzes/${id}`);
    return data;
  } catch (err) { throw new Error(toError(err, 'Failed to delete quiz.')); }
}

// ── Questions ────────────────────────────────────────────────────────────────
export async function addQuestion(quizId, payload) {
  try {
    const { data } = await api.post(`/faculty/quizzes/${quizId}/questions`, payload);
    return data.question;
  } catch (err) { throw new Error(toError(err, 'Failed to add question.')); }
}

export async function getQuestions(quizId) {
  try {
    const { data } = await api.get(`/faculty/quizzes/${quizId}/questions`);
    return data.questions;
  } catch (err) { throw new Error(toError(err, 'Failed to load questions.')); }
}

export async function updateQuestion(id, payload) {
  try {
    const { data } = await api.put(`/faculty/questions/${id}`, payload);
    return data.question;
  } catch (err) { throw new Error(toError(err, 'Failed to update question.')); }
}

export async function deleteQuestion(id) {
  try {
    const { data } = await api.delete(`/faculty/questions/${id}`);
    return data;
  } catch (err) { throw new Error(toError(err, 'Failed to delete question.')); }
}

// ── Results ──────────────────────────────────────────────────────────────────
export async function getStudentResults(quizId) {
  try {
    const url = quizId ? `/faculty/results?quizId=${quizId}` : '/faculty/results';
    const { data } = await api.get(url);
    return data;
  } catch (err) { throw new Error(toError(err, 'Failed to load results.')); }
}

// ── Profile ──────────────────────────────────────────────────────────────────
export async function getProfile() {
  try {
    const { data } = await api.get('/faculty/profile');
    return data.profile;
  } catch (err) { throw new Error(toError(err, 'Failed to load profile.')); }
}

export async function updateProfile(payload) {
  try {
    const { data } = await api.put('/faculty/profile', payload);
    return data.profile;
  } catch (err) { throw new Error(toError(err, 'Failed to update profile.')); }
}
