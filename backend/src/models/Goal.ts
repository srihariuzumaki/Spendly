import mongoose, { Document, Schema } from 'mongoose';

export interface IGoalContribution {
  amount: number;
  date: Date;
  note?: string;
}

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  emoji: string;
  target: number;
  contributions: IGoalContribution[];
}

const GoalContributionSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  note: { type: String },
});

const GoalSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    emoji: { type: String, default: '🎯' },
    target: { type: Number, required: true },
    contributions: [GoalContributionSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IGoal>('Goal', GoalSchema);
