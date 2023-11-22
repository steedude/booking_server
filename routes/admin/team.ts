import express from 'express';
import passport from 'passport';
import teamController from '@/controllers/admin/teamController';

const router = express.Router();

router.get('/teams', teamController.read);
router.post('/team', passport.authenticate('AdminJwt'), teamController.create);
router.delete('/team/:team_id', passport.authenticate('AdminJwt'), teamController.delete);
router.put('/team/:team_id', passport.authenticate('AdminJwt'), teamController.update);

export default router;
