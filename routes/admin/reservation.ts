import express from 'express';
import passport from '@/config/passport';
import reservationController from '@/controllers/admin/reservationController';

const router = express.Router();
const authenticated = passport.authenticate('AdminJwt', { session: false });

router.get('/reservations', authenticated, reservationController.getReservations);
// router.post('/reservation', authenticated, reservationController.postReservation);
// router.delete('/reservation/:reservation_id', authenticated, reservationController.deleteReservation);
// router.get('/reservations/history', authenticated, reservationController.getHistoryReservations);
// router.get('/reservations/future', authenticated, reservationController.getFutureReservations);

export default router;
