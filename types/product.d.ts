import type { Types } from 'mongoose';

export interface IProduct {
  id: Types.ObjectId;
  name: string;
  seats: number;
  image: Array<string>;
  description: string;
  projector: boolean;
  television: boolean;
  window: boolean;
  is_confirmed: boolean;
}
