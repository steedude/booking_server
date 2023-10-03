import express from 'express';
import userRouter from './user';
import productRouter from './product';

const router = express.Router();

router.use('/', userRouter);
router.use('/', productRouter);

export default router;
