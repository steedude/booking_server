import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Team } from '@/models/team';

const teamController = {
  async create(req: Request, res: Response) {
    const { name } = req.body;
    try {
      await Team.create({
        name,
      });
      return res.status(200).json({ status: 200, message: 'success' });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const teamId = req.params.team_id;
      const isValidId = Types.ObjectId.isValid(teamId);

      if (!isValidId) {
        return res.status(400).json({ status: 400, message: '此id不合法' });
      }

      await Team.deleteOne({ _id: teamId });
      return res.json({ status: 200, message: 'success' });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e });
    }
  },

  async read(_: Request, res: Response) {
    try {
      const documents = await Team.find({});
      return res.json({ status: 200, message: 'success', data: documents });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e });
    }
  },

  async update(req: Request, res: Response) {
    const { name } = req.body;
    try {
      const teamId = req.params.team_id;
      const isValidId = Types.ObjectId.isValid(teamId);

      if (!isValidId) {
        return res.status(400).json({ status: 400, message: '此id不合法' });
      }

      const team = await Team.findById(teamId);

      if (!team) {
        return res.status(400).json({ status: 400, message: '查無此id' });
      }
      team.name = name;
      await team.save();
      return res.status(200).json({ status: 200, message: 'success' });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err });
    }
  },
};

export default teamController;
