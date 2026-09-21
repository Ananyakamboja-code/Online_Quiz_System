/**
 * Admin service — real API.
 *
 * Dashboard stats and faculty listing from /api/admin.
 */
import api from './api';

export const getDashboardStats = () =>
  api.get('/admin/stats').then((res) => res.data);

// Faculty users with quizzesCreated + status (for the Faculty Details page
// and the quiz form's faculty dropdown).
export const getFaculty = () =>
  api.get('/admin/faculty').then((res) => res.data);
