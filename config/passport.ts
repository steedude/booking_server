import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import passportJwt, { VerifiedCallback } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { Admin } from '../models/admin';

const JWT_STRATEGY_OPTIONS = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

async function verifyLocalFunc(
  target: typeof User | typeof Admin,
  username: string,
  password: string,
  done: VerifiedCallback,
) {
  try {
    const lowerCaseAccount = username.toLowerCase();
    const user = (await target.findOne({ account: lowerCaseAccount })) || false;
    if (!user) throw new Error('user not found!');
    if (!bcrypt.compareSync(password, user.password)) throw new Error('wrong password!');
    return done(undefined, user, null);
  } catch (err: unknown) {
    console.log(err);
    if (err) return done(err, false, null);
    return done(undefined, false, null);
  }
}

passport.use(
  'UserLocal',
  new LocalStrategy({ usernameField: 'account' }, (username, password, done) => {
    return verifyLocalFunc(User, username, password, done);
  }),
);

passport.use(
  'AdminLocal',
  new LocalStrategy({ usernameField: 'account' }, (username, password, done) => {
    return verifyLocalFunc(Admin, username, password, done);
  }),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyJwtCB(target: typeof User | typeof Admin, jwtToken: any, done: VerifiedCallback) {
  try {
    const user = (await target.findById(jwtToken.id)) || false;
    return done(undefined, user);
  } catch (err: unknown) {
    if (err) return done(err, false, null);
    return done(undefined, false, null);
  }
}

passport.use(
  'UserJwt',
  new passportJwt.Strategy(JWT_STRATEGY_OPTIONS, (jwtToken, done) => {
    return verifyJwtCB(User, jwtToken, done);
  }),
);

passport.use(
  'AdminJwt',
  new passportJwt.Strategy(JWT_STRATEGY_OPTIONS, (jwtToken, done) => {
    return verifyJwtCB(Admin, jwtToken, done);
  }),
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) done(undefined, user);
    const admin = await Admin.findById(id);
    if (admin) done(undefined, admin);
  } catch (err: unknown) {
    done(err);
  }
});

export default passport;
