import type { Request, Response } from 'express';
import { Reservation } from '@/models/reservation';
import { Product } from '@/models/product';
import '@/models/team';
import { formatCatchErrorMessage } from '@/utils/errorMessage';
import type { IUser } from '@/types/user';
import type { ITeam } from '@/types/team';

const reservationController = {
  async postReservation(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.body.product_id).exec();

      if (!product) throw new Error('The product_id could not be found');
      const { is_confirmed: isNeedConfirmed } = product;
      const reservation = new Reservation({
        ...req.body,
        start_time: new Date(req.body.start_time),
        end_time: new Date(req.body.end_time),
        confirmed: !isNeedConfirmed,
        user_id: req.user?.id,
      });

      await reservation.save();
      return res.json({
        status: 200,
        message: 'appointment successful',
      });
    } catch (error) {
      return res.status(400).json({ status: 400, message: formatCatchErrorMessage(error) });
    }
  },
  deleteReservation(req: Request, res: Response) {
    Reservation.findOneAndDelete({ _id: req.params.reservation_id, user_id: req.user?.id })
      .then(() => {
        return res.json({
          status: 200,
          message: 'appointment canceled',
        });
      })
      .catch(error => res.status(400).json({ status: 400, message: error.message }));
  },
  getReservations(req: Request, res: Response) {
    const time = new Date(req.body.start_time);

    Reservation.find({
      start_time: {
        $gte: time,
        $lt: new Date(time.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .populate('product_id', 'name')
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
        const mappingReservations = reservations.map(({ product_id: product, user_id: user, ...reservation }) => {
          const team = ((user as unknown as IUser)?.team_id as unknown as ITeam)?.name;

          return {
            ...reservation,
            product,
            team,
          };
        });

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
  getHistoryReservations(req: Request, res: Response) {
    const filter = { $lt: new Date() };

    getMineReservations(req, res, filter);
  },
  getFutureReservations(req: Request, res: Response) {
    const filter = { $gt: new Date() };

    getMineReservations(req, res, filter);
  },
};

function getMineReservations(req: Request, res: Response, filter: Record<string, Date>) {
  const { page = 1, page_size: limit = 30 } = req.body;
  const skip = +limit * (+page - 1);
  const query = {
    user_id: req.user?.id,
    start_time: filter,
  };

  Reservation.find(query, null, { skip, limit })
    .populate('product_id', 'name')
    .lean()
    .sort({ start_time: 'asc', end_time: 'asc' })
    .exec()
    .then(async reservations => {
      const totalSize = await Reservation.countDocuments(query);

      return res.json({
        status: 200,
        message: 'success',
        data: {
          reservations,
          page,
          page_size: limit,
          total_page: Math.ceil(totalSize / limit),
          total_size: totalSize,
        },
      });
    })
    .catch(error => res.status(400).json({ status: 400, message: error.message }));
}

export default reservationController;
