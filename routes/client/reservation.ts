import express from 'express';
import passport from '@/config/passport';
import reservationController from '@/controllers/client/reservationController';

const router = express.Router();
const authenticated = passport.authenticate('UserJwt', { session: false });

router.post('/reservation', authenticated, reservationController.postReservation);
router.delete('/reservation/:reservation_id', authenticated, reservationController.deleteReservation);
router.get('/reservations', reservationController.getReservations);

export default router;
