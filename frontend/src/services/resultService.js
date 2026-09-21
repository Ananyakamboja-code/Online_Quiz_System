/**
 * Result service (Admin, read-only) — real API.
 *
 * Results from /api/admin/results already include studentName, quizTitle,
 * facultyName, and percentage.
 */
import api from './api';

export const getResults = () =>
  api.get('/admin/results').then((res) => res.data);
