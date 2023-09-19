import type { Express } from 'express';
import client from './client';
import admin from './admin';

export default (app: Express) => {
  app.use('/api', client);
  app.use('/api/admin', admin);
};
