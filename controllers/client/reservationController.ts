import type { Request, Response } from 'express';
import { Reservation } from '@/models/reservation';
import { Product } from '@/models/product';
import '@/models/team';
import { formatCatchErrorMessage } from '@/utils/errorMessage';

const reservationController = {
  async postReservation(req: Request, res: Response) {
    try {
      const { start_time: startTime, end_time: endTime, product_id: productId } = req.body;

      if (!startTime || !endTime || !productId) {
        throw new Error('missing required parameter');
      }
      const product = await Product.findById(productId).exec();

      if (!product) throw new Error('The product_id could not be found');
      const { is_confirmed: isNeedConfirmed } = product;
      const reservation = new Reservation({
        ...req.body,
        start_time: new Date(startTime),
        end_time: new Date(endTime),
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
      .then(() => res.json({ status: 200, message: 'appointment canceled' }))
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
