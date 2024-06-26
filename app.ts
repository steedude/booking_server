import 'module-alias/register';
import express from 'express';
import session from 'express-session';
import { urlencoded, json } from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import routes from './routes';
import passport from './config/passport';

const port = 8080;
const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use(
  session({
    secret: 'booking',
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/booking')
  .then(() => console.log('connected to database'));

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

export default routes(app);
