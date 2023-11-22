import { Schema, model } from 'mongoose';
import type { IUser } from '../types/user';

const userSchema = new Schema<IUser>({
  account: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  team_id: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: false,
  },
  image: {
    type: String,
  },
});

const User = model<IUser>('User', userSchema);

export { User, IUser };
