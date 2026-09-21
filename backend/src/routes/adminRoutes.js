import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  listQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from '../controllers/quizController.js';
import { getStats, listFaculty } from '../controllers/adminController.js';
import { listResults } from '../controllers/resultController.js';

const router = Router();

// Every admin route requires a valid token AND the ADMIN role.
router.use(requireAuth, requireRole('ADMIN'));

// Dashboard
router.get('/stats', getStats);

// Quizzes
router.get('/quizzes', listQuizzes);
router.get('/quizzes/:id', getQuiz);
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

// Faculty
router.get('/faculty', listFaculty);

// Results
router.get('/results', listResults);

export default router;
