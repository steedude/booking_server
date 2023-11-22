import express from 'express';
import passport from 'passport';
import userController from '@/controllers/client/userController';

const router = express.Router();

const authenticated = passport.authenticate('UserJwt', { session: false });

router.post('/login', passport.authenticate('UserLogin'), userController.loginSuccess);
router.post('/register', passport.authenticate('UserRegister'), userController.registerSuccess);
router.post('/googleAuth', passport.authenticate('UserGoogle'), userController.authGoogleSuccess);
router.get('/user', userController.getUser);
router.post('/userSetting', authenticated, userController.setUserInfo);
router.post('/password', authenticated, userController.changePassword);
router.post('/logout', authenticated, userController.logout);

export default router;
