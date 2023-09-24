import { Schema, model } from 'mongoose';
import type { IUser } from '../types/user';

const adminSchema = new Schema<IUser>({
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
    required: false,
  },
});

const Admin = model<IUser>('Admin', adminSchema);

export { Admin, IUser };
