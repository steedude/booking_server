import express from 'express';
// import passport from '@/config/passport';
import userController from '@/controllers/client/userController';

const router = express.Router();

router.get('/login', userController.login);

export default router;
