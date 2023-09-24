import type { Types, Document } from 'mongoose';

export interface IUser {
  id: Types.ObjectId;
  account: string;
  password: string;
  name: string;
  team_id: Types.ObjectId;
}

export type User = Document<unknown, unknown, IUser> & IUser & { _id: Types.ObjectId };
