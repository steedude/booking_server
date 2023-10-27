import express from 'express';
import passport from '@/config/passport';
import reservationController from '@/controllers/client/reservationController';
import commonController from '@/controllers/commonController';

const router = express.Router();
const authenticated = passport.authenticate('UserJwt', { session: false });

router.post('/reservation', authenticated, reservationController.postReservation);
router.delete('/reservation/:reservation_id', authenticated, reservationController.deleteReservation);
router.get('/reservations/day', commonController.getDayReservations);
router.get('/reservations/history', authenticated, reservationController.getHistoryReservations);
router.get('/reservations/future', authenticated, reservationController.getFutureReservations);

export default router;
