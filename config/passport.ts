import passport from 'passport';
import passportJwt, { VerifiedCallback } from 'passport-jwt';
import { User } from '../models/user';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyJwtCB = async (jwtToken: any, done: VerifiedCallback) => {
  try {
    const user = (await User.findOne({ account: jwtToken.account.toLowerCase() })) || false;
    return done(undefined, user);
  } catch (err: unknown) {
    if (err) {
      return done(err, false, null);
    }

    return done(undefined, false, null);
  }
};

passport.use(
  'UserJwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    verifyJwtCB,
  ),
);

passport.serializeUser((user: Express.User, done) => {
  interface ICustomUser extends Express.User {
    id: string; // Adjust the type of 'id' as needed
  }
  done(null, (user as ICustomUser).id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: Error, user: Express.User) => {
    done(err, user);
  });
});

export default passport;
