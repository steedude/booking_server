import type { Types, Document } from 'mongoose';

export interface IUser {
  account: string;
  password: string;
  name: string;
  team: Types.ObjectId;
}

export type User = Document<unknown, unknown, IUser> & IUser & { _id: Types.ObjectId };
