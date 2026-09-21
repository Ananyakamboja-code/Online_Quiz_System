import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  createQuiz,
  getMyQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  getStudentResults,
  getProfile,
  updateProfile,
} from '../controllers/facultyController.js';

const router = Router();

// All faculty routes require authentication + FACULTY role
router.use(requireAuth, requireRole('FACULTY'));

// ── Dashboard ──────────────────────────────────────────────────────────────
router.get('/dashboard/stats', getDashboardStats);

// ── Quizzes CRUD ───────────────────────────────────────────────────────────
router.post('/quizzes', createQuiz);
router.get('/quizzes', getMyQuizzes);
router.get('/quizzes/:id', getQuizById);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

// ── Questions CRUD ─────────────────────────────────────────────────────────
router.post('/quizzes/:quizId/questions', addQuestion);
router.get('/quizzes/:quizId/questions', getQuestions);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// ── Results ────────────────────────────────────────────────────────────────
router.get('/results', getStudentResults);

// ── Profile ────────────────────────────────────────────────────────────────
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
