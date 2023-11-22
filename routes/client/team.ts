import express from 'express';
import teamController from '@/controllers/client/teamController';

const router = express.Router();

router.get('/teams', teamController.read);

export default router;
