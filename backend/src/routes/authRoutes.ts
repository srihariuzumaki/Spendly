import { Router } from 'express';
import { register, login, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Endpoint: /api/auth/register
router.post('/register', register);

// Endpoint: /api/auth/login
router.post('/login', login);

// Endpoint: /api/auth/profile
router.put('/profile', authenticateToken, updateProfile);

export default router;
