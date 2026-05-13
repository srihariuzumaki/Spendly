import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  currency: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '👤' },
    currency: { type: String, default: '$' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
