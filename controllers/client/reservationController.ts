import type { Request, Response } from 'express';
import { Reservation } from '@/models/reservation';

const reservationController = {
  postReservation(req: Request, res: Response) {
    const reservation = new Reservation({ ...req.body });

    reservation
      .save()
      .then(() => {
        return res.json({
          status: 200,
          message: 'appointment successful',
        });
      })
      .catch(error => res.status(400).json({ status: 'error', message: error.message }));
  },
};

export default reservationController;
