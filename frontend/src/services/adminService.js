/**
 * Admin dashboard service.
 *
 * Provides aggregate counts for the dashboard summary cards. Mock-backed for
 * now (derived from mock users/quizzes); later this can hit a single stats
 * endpoint or aggregate several calls to http://localhost:8080/api.
 */
import { mockUsers, mockQuizzes } from '../data/mockData';
// import api from './api';

const resolve = (data) => Promise.resolve(data);

export const getDashboardStats = () => {
  // return api.get('/admin/stats').then((res) => res.data);
  const totalUsers = mockUsers.length;
  const totalStudents = mockUsers.filter((u) => u.role === 'STUDENT').length;
  const totalFaculty = mockUsers.filter((u) => u.role === 'FACULTY').length;
  const totalQuizzes = mockQuizzes.length;

  return resolve({ totalUsers, totalStudents, totalFaculty, totalQuizzes });
};
