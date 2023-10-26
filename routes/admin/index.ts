import express from 'express';
import userRouter from './user';
import productRouter from './product';
import reservationRouter from './reservation';

const router = express.Router();

router.use('/', userRouter);
router.use('/', productRouter);
router.use('/', reservationRouter);

export default router;
