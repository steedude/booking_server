import express from 'express';
// import passport from 'passport';
import userController from '@/controllers/admin/userController';

const router = express.Router();

router.get('/login', userController.login);
router.post('/googleAuth', userController.postAuthGoogle);
// router.post('/login', passport.authenticate('AdminLocal'), userController.loginSuccess);

export default router;
