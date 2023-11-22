import type { Request, Response } from 'express';
import { Team } from '@/models/team';

const teamController = {
  async read(_: Request, res: Response) {
    try {
      const documents = await Team.find({});
      return res.json({ status: 200, message: 'success', data: documents });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e });
    }
  },
};

export default teamController;
