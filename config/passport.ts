import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import type { IUser } from '../types/user';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(
  new LocalStrategy(
    { usernameField: 'account' },
    (
      account: string,
      password: string,
      done: (arg0: Error | undefined, arg1: IUser | undefined, arg2: { message: string } | undefined) => unknown,
    ) => {
      User.findOne({ account: account.toLowerCase() }, (err: Error, user: IUser) => {
        if (err) {
          return done(err, undefined, undefined);
        }
        if (!user) {
          return done(undefined, undefined, { message: `account ${account} not found.` });
        }
        bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
          if (bcryptErr) throw bcryptErr;
          return isMatch
            ? done(undefined, user, undefined)
            : done(undefined, undefined, { message: 'account or password incorrect' });
        });
        return undefined;
      });
    },
  ),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtToken, done) => {
      User.findOne({ account: jwtToken.account }, (err: Error, user: IUser) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(undefined, user, jwtToken);
        }
        return done(undefined, false);
      });
    },
  ),
);

export default passport;
