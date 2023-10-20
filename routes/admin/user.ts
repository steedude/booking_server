import express from 'express';
import passport from 'passport';
import userController from '@/controllers/admin/userController';

const router = express.Router();

router.post('/login', passport.authenticate('AdminLocalLogin'), userController.loginSuccess);
router.post('/register', passport.authenticate('AdminLocalRegister'), userController.loginSuccess);
router.post('/googleAuth', passport.authenticate('AdminLocalGoogle'), userController.authGoogleSuccess);
router.post('/logout', passport.authenticate('AdminJwt', { session: false }), userController.logout);

export default router;
