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
    const skip = +limit * (+page - 1);
    const query = {
      start_time: {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      },
      ...(productId ? { product_id: productId } : {}),
    };

    Reservation.find(query, null, { skip, limit })
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
          ({ product_id: product, user_id: userId, team_id: team, ...reservation }) => {
            const user = userId as unknown as IUser;

            return {
              ...reservation,
              product,
              user: {
                account: user.account,
                name: user.name,
              },
              team: (user?.team_id as unknown as ITeam)?.name ?? team,
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
};

export default reservationController;
