import type { Request, Response } from 'express';
import { Reservation } from '@/models/reservation';
import { Product } from '@/models/product';
import { Team } from '@/models/team';
import { formatCatchErrorMessage } from '@/utils/errorMessage';
import type { IUser } from '@/types/user';

const reservationController = {
  async postReservation(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.body.product_id).exec();

      if (!product) throw new Error('The product_id could not be found');
      const { is_confirmed: isNeedConfirmed } = product;
      const reservation = new Reservation({
        ...req.body,
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
    const startTime = req.body.start_time.slice(0, 10);
    const regexp = RegExp('^' + startTime);

    Reservation.find({ start_time: regexp })
      .populate('product_id', 'name')
      .populate('user_id', 'team_id')
      .lean()
      .exec()
      .then(async reservations => {
        const reservationsPromises = reservations.map(
          async ({ product_id: product, user_id: userId, ...reservation }) => {
            const user = userId as unknown as IUser;
            const team = await Team.findById(user.team_id);

            return {
              ...reservation,
              product,
              team: team?.name,
            };
          },
        );
        const mappingReservations = await Promise.all(reservationsPromises);

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

export default reservationController;
