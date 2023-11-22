import type { Types, Document } from 'mongoose';

export interface IUser {
  updateOne(arg0: { team_id: number }): unknown;
  id: Types.ObjectId;
  account: string;
  password: string;
  name: string;
  team_id: Types.ObjectId;
  image: string;
}

export type User = Document<unknown, unknown, IUser> & IUser & { _id: Types.ObjectId };
