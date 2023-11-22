import type { Request, Response } from 'express';
import { Reservation } from '@/models/reservation';
import { isString } from '@/utils/checkType';
import type { IUser } from '@/types/user';
import type { ITeam } from '@/types/team';

const commonController = {
  getDayReservations(req: Request, res: Response) {
    const { start_time: startTime } = req.query;

    if (!startTime || !isString(startTime)) {
      return res.status(400).json({ status: 400, message: 'start_time is required parameter' });
    }
    const time = new Date(startTime);

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

export async function checkReservation(start: Date, end: Date, productId: string) {
  if (+end.valueOf() - +start.valueOf() < 30 * 60 * 1000) {
    return 'The appointment time cannot be less than 30 minutes';
  }
  if (start < new Date()) {
    return 'Unable to reserve time in the past';
  }
  const reservations = await Reservation.find({
    $or: [
      {
        start_time: {
          $gte: start,
          $lt: end,
        },
      },
      {
        end_time: {
          $gt: start,
          $lte: end,
        },
      },
    ],
    product_id: productId,
  }).exec();

  return reservations.length ? 'Time period overlap' : '';
}

export default commonController;
