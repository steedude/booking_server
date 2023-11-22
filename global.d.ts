import type { Types } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      id: Types.ObjectId;
      team_id: Types.ObjectId;
    }
  }
}

export {};
