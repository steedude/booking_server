import express from 'express';
import userRouter from './user';
import productRouter from './product';
import reservationRouter from './reservation';
import teamRouter from './team';

const router = express.Router();

router.use('/', userRouter);
router.use('/', productRouter);
router.use('/', reservationRouter);
router.use('/', teamRouter);

export default router;
