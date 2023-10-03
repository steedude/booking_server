import express from 'express';
import passport from 'passport';
import userController from '@/controllers/client/userController';

const router = express.Router();

router.post('/login', passport.authenticate('UserLocal'), userController.loginSuccess);
router.post('/register', userController.register);
router.post('/googleAuth', userController.authGoogle);
router.post('/logout', passport.authenticate('UserJwt', { session: false }), userController.logout);

export default router;
