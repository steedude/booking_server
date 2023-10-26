import express from 'express';
import passport from 'passport';
import userController from '@/controllers/client/userController';

const router = express.Router();

router.post('/login', passport.authenticate('UserLogin'), userController.loginSuccess);
router.post('/register', passport.authenticate('UserRegister'), userController.registerSuccess);
router.post('/googleAuth', passport.authenticate('UserGoogle'), userController.authGoogleSuccess);
router.post('/logout', passport.authenticate('UserJwt', { session: false }), userController.logout);

export default router;
