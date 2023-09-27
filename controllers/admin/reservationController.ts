import type { Request, Response } from 'express';
import { Reservation } from '@/models/reservation';
import '@/models/team';
import type { IUser } from '@/types/user';
import type { ITeam } from '@/types/team';
import type { IProduct } from '@/types/product';

const reservationController = {
  getReservations(req: Request, res: Response) {
    const {
      start_time: startTime,
      end_time: endTime,
      product_id: productId,
      seats = 0,
      page = 1,
      page_size: limit = 30,
    } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ status: 400, message: 'missing required parameter' });
    }
    const skip = +limit * (+page - 1);
    const query = {
      start_time: {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      },
      ...(productId ? { product_id: productId } : {}),
    };

    return Reservation.find(query, null, { skip, limit })
      .populate({
        path: 'user_id',
        populate: {
          path: 'team_id',
          model: 'Team',
        },
      })
      .populate('admin_id')
      .populate('team_id', 'name')
      .populate('product_id')
      .lean()
      .sort({ start_time: 'asc', end_time: 'asc' })
      .exec()
      .then(async reservations => {
        const totalSize = await Reservation.countDocuments(query);
        const filterReservations = reservations.filter(reservation => {
          const product = reservation.product_id as unknown as IProduct;

          return product.seats >= seats;
        });
        const mappingReservations = filterReservations.map(
          ({ product_id: product, user_id: userId, admin_id: adminId, team_id: teamId, ...reservation }) => {
            const user = userId as unknown as IUser;
            const admin = adminId as unknown as IUser;
            const team = (user?.team_id ?? teamId) as unknown as ITeam;

            return {
              ...reservation,
              product,
              ...(user
                ? { user: { account: user.account, name: user.name } }
                : { admin: { account: admin.account, name: admin.name } }),
              team: team.name,
            };
          },
        );

        return res.json({
          status: 200,
          message: 'success',
          data: {
            reservations: mappingReservations,
            page,
            page_size: limit,
            total_page: Math.ceil(totalSize / limit),
            total_size: totalSize,
          },
        });
      })
      .catch(error => res.status(400).json({ status: 400, message: error.message }));
  },
  postReservation(req: Request, res: Response) {
    const { start_time: startTime, end_time: endTime, product_id: productId, team_id: teamId } = req.body;

    if (!startTime || !endTime || !productId || !teamId) {
      return res.status(400).json({ status: 400, message: 'missing required parameter' });
    }
    const reservation = new Reservation({
      ...req.body,
      start_time: new Date(startTime),
      end_time: new Date(endTime),
      confirmed: true,
      admin_id: req.user?.id,
    });

    return reservation
      .save()
      .then(() => res.json({ status: 200, message: 'appointment successful' }))
      .catch(error => res.status(400).json({ status: 400, message: error.message }));
  },
  agreeReservation(req: Request, res: Response) {
    Reservation.findOneAndUpdate({ _id: req.params.reservation_id }, { confirmed: true })
      .then(() => res.json({ status: 200, message: 'appointment with consent' }))
      .catch(error => res.status(400).json({ status: 400, message: error.message }));
  },
  deleteReservation(req: Request, res: Response) {
    Reservation.findOneAndDelete({ _id: req.params.reservation_id })
      .then(() => res.json({ status: 200, message: 'appointment canceled' }))
      .catch(error => res.status(400).json({ status: 400, message: error.message }));
  },
};

export default reservationController;
