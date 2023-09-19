import express from 'express';
import userRouter from './user';
import reservationRouter from './reservation';

const router = express.Router();

router.use('/', userRouter);
router.use('/', reservationRouter);

export default router;
