import type { Request, Response } from 'express';
import { Reservation } from '@/models/reservation';
import type { IUser } from '@/types/user';
import type { ITeam } from '@/types/team';

const commonController = {
  getDayReservations(req: Request, res: Response) {
    if (!req.body.start_time) {
      return res.status(400).json({ status: 400, message: 'start_time is required parameter' });
    }
    const time = new Date(req.body.start_time);

    return Reservation.find({
      start_time: {
        $gte: time,
        $lt: new Date(time.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .populate('product_id', 'name')
      .populate('team_id', 'name')
      .populate({
        path: 'user_id',
        populate: {
          path: 'team_id',
          model: 'Team',
        },
      })
      .lean()
      .exec()
      .then(reservations => {
        const mappingReservations = reservations.map(
          ({ product_id: product, user_id: userId, team_id: teamId, ...reservation }) => {
            const user = userId as unknown as IUser;
            const team = (user?.team_id ?? teamId) as unknown as ITeam;

            return {
              ...reservation,
              product,
              team: team.name,
            };
          },
        );

        return res.json({
          status: 200,
          message: 'success',
          data: {
            reservations: mappingReservations,
          },
        });
      })
      .catch(error => res.status(400).json({ status: 400, message: error.message }));
  },
};

export default commonController;
