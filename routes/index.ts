import type { Express } from 'express';
import client from './client';
import admin from './admin';
import type { Request, Response } from 'express';

export default (app: Express) => {
  app.use('/api', client);
  app.use('/api/admin', admin);
  app.get('/', (_: Request, res: Response) => {
    res.status(200).send('連線成功');
  });
};
