import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController';

const router = Router();

// Protect all transaction routes
router.use(authenticateToken);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

export default router;
