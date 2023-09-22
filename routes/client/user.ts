import express from 'express';
import passport from 'passport';
import userController from '@/controllers/client/userController';

const router = express.Router();

const authenticated = passport.authenticate('UserJwt', { session: false });

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/googleAuth', userController.authGoogle);
router.post('/logout', authenticated, userController.logout);

export default router;
