import express from 'express';
import userController from '@/controllers/client/userController';

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/logout', userController.logout);

export default router;
