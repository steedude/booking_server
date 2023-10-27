import express from 'express';
import passport from '@/config/passport';
import reservationController from '@/controllers/admin/reservationController';
import commonController from '@/controllers/commonController';

const router = express.Router();
const authenticated = passport.authenticate('AdminJwt', { session: false });

router.get('/reservations', authenticated, reservationController.getReservations);
router.post('/reservation', authenticated, reservationController.postReservation);
router.put('/reservation/:reservation_id', authenticated, reservationController.agreeReservation);
router.delete('/reservation/:reservation_id', authenticated, reservationController.deleteReservation);
router.get('/reservations/day', commonController.getDayReservations);

export default router;
