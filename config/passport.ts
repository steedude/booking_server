import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import passportJwt, { VerifiedCallback } from 'passport-jwt';
import { Strategy as CustomStrategy } from 'passport-custom';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
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
    if (!user) return done(undefined, false, 'user not found!');
    if (!bcrypt.compareSync(password, user.password)) return done(undefined, false, "password doesn't match");
    return done(undefined, user, null);
  } catch (err: unknown) {
    if (err) return done(err, false, null);
    return done(undefined, false, null);
  }
}

passport.use(
  'UserLogin',
  new LocalStrategy({ usernameField: 'account' }, (username, password, done) => {
    return verifyLocalFunc(User, username, password, done);
  }),
);

passport.use(
  'AdminLogin',
  new LocalStrategy({ usernameField: 'account' }, (username, password, done) => {
    return verifyLocalFunc(Admin, username, password, done);
  }),
);

async function registerFunc(
  target: typeof User | typeof Admin,
  account: string,
  password: string,
  name: string | undefined = undefined,
) {
  const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());
  const userDoc = {
    account,
    password: hashedPassword,
    name: name || account,
  };
  const newUser = target === User ? new User(userDoc) : new Admin(userDoc);
  await newUser.save();
  return newUser;
}

async function verifyRegisterFunc(
  target: typeof User | typeof Admin,
  username: string,
  password: string,
  done: VerifiedCallback,
) {
  try {
    const lowerCaseAccount = username.toLowerCase();
    const user = (await target.findOne({ account: lowerCaseAccount })) || false;
    if (user) return done(undefined, false, 'user Exit!');
    const newUser = await registerFunc(target, lowerCaseAccount, password);
    return done(undefined, newUser, null);
  } catch (err: unknown) {
    console.log(err);
    if (err) return done(err, false, null);
    return done(undefined, false, null);
  }
}

passport.use(
  'UserRegister',
  new LocalStrategy({ usernameField: 'account' }, (username, password, done) => {
    return verifyRegisterFunc(User, username, password, done);
  }),
);

passport.use(
  'AdminRegister',
  new LocalStrategy({ usernameField: 'account' }, (username, password, done) => {
    return verifyRegisterFunc(Admin, username, password, done);
  }),
);

async function verifyGoogle(target: typeof User | typeof Admin, credential: string | unknown, done: VerifiedCallback) {
  const client = new OAuth2Client();
  async function verify() {
    if (typeof credential !== 'string') return done(undefined, false, 'credential not found!!');
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    const lowerCaseAccount = payload?.email?.toLowerCase();
    if (!lowerCaseAccount) return done(undefined, false, 'email not found!!');
    let user = await target.findOne({ account: lowerCaseAccount });
    if (!user) user = await registerFunc(target, lowerCaseAccount, process.env.DEFAULT_GOOGLE_PASSWORD!, payload?.name);
    return done(undefined, user, null);
  }
  verify().catch(console.error);
}

passport.use(
  'UserGoogle',
  new CustomStrategy((req, done) => {
    return verifyGoogle(User, req.body?.credential, done);
  }),
);

passport.use(
  'AdminGoogle',
  new CustomStrategy((req, done) => {
    return verifyGoogle(Admin, req.body?.credential, done);
  }),
);

async function verifyJwtCB(target: typeof User | typeof Admin, userId: number, done: VerifiedCallback) {
  try {
    const user = (await target.findById(userId)) || false;
    return done(undefined, user);
  } catch (err: unknown) {
    if (err) return done(err, false, null);
    return done(undefined, false, null);
  }
}

passport.use(
  'UserJwt',
  new passportJwt.Strategy(JWT_STRATEGY_OPTIONS, (jwtToken, done) => {
    return verifyJwtCB(User, jwtToken.id, done);
  }),
);

passport.use(
  'AdminJwt',
  new passportJwt.Strategy(JWT_STRATEGY_OPTIONS, (jwtToken, done) => {
    return verifyJwtCB(Admin, jwtToken.id, done);
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
