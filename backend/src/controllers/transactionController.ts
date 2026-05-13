import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Transaction from '../models/Transaction';

// @route GET /api/transactions
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await Transaction.find({ userId: req.user?.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// @route POST /api/transactions
export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, category, merchant, type, date, note } = req.body;
    const newTransaction = new Transaction({
      userId: req.user?.id,
      amount,
      category,
      merchant,
      type,
      date,
      note,
    });
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

// @route DELETE /api/transactions/:id
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
