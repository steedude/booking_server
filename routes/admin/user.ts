import express from 'express';
import passport from 'passport';
import userController from '@/controllers/admin/userController';

const router = express.Router();

router.post('/login', passport.authenticate('AdminLogin'), userController.loginSuccess);
router.post('/register', passport.authenticate('AdminRegister'), userController.registerSuccess);
router.post('/googleAuth', passport.authenticate('AdminGoogle'), userController.authGoogleSuccess);
router.post('/logout', passport.authenticate('AdminJwt', { session: false }), userController.logout);

export default router;
