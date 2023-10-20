import express from 'express';
import passport from 'passport';
import userController from '@/controllers/client/userController';

const router = express.Router();

router.post('/login', passport.authenticate('UserLocalLogin'), userController.loginSuccess);
router.post('/register', passport.authenticate('UserLocalRegister'), userController.registerSuccess);
router.post('/googleAuth', passport.authenticate('UserLocalGoogle'), userController.authGoogleSuccess);
router.post('/logout', passport.authenticate('UserJwt', { session: false }), userController.logout);

export default router;
