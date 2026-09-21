import { Router } from 'express';
import {
  listQuizzes,
  getQuiz,
  getQuizQuestions,
  submitQuiz,
  listResults,
  getResult,
} from '../controllers/studentController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Every student route requires a valid token AND the STUDENT role.
router.use(requireAuth, requireRole('STUDENT'));

// Quizzes
router.get('/quizzes', listQuizzes);
router.get('/quizzes/:id', getQuiz);
router.get('/quizzes/:id/questions', getQuizQuestions);
router.post('/quizzes/:id/submit', submitQuiz);

// Results
router.get('/results', listResults);
router.get('/results/:id', getResult);

export default router;
