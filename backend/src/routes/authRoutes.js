import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public
router.post('/register', register);
router.post('/login', login);

// Protected — validates the token and returns the current user.
router.get('/me', requireAuth, me);

export default router;
