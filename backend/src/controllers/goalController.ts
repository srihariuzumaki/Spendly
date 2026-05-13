import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Goal from '../models/Goal';

// @route GET /api/goals
export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const goals = await Goal.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

// @route POST /api/goals
export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { name, emoji, target } = req.body;
    const newGoal = new Goal({
      userId: req.user?.id,
      name,
      emoji,
      target,
      contributions: [],
    });
    const saved = await newGoal.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

// @route DELETE /api/goals/:id
export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};

// @route POST /api/goals/:id/contribute
export const addContribution = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, date, note } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user?.id });
    
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    goal.contributions.push({ amount, date, note });
    const saved = await goal.save();
    
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add contribution' });
  }
};
