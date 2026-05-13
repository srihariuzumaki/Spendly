import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getGoals, createGoal, deleteGoal, addContribution } from '../controllers/goalController';

const router = Router();

// Protect all goal routes
router.use(authenticateToken);

router.get('/', getGoals);
router.post('/', createGoal);
router.delete('/:id', deleteGoal);
router.post('/:id/contribute', addContribution);

export default router;
