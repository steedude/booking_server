import express from 'express';
// import passport from '@/config/passport';
import reservationController from '@/controllers/client/reservationController';

const router = express.Router();

router.post('/reservation', reservationController.postReservation);

export default router;
