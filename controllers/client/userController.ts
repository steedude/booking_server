import type { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@/models/user';
import { OAuth2Client } from 'google-auth-library';

function getErrorRes(res: Response) {
  return res.status(400).json({
    status: 400,
    message: 'authorization failed',
  });
}

async function loginFunc(req: Request, res: Response) {
  const { account, password } = req.body;
  const lowerCaseAccount = account.toLowerCase();

  if (!lowerCaseAccount || !password) return getErrorRes(res);
  const user = await User.findOne({ account: lowerCaseAccount });
  if (!user) return getErrorRes(res);

  if (!bcrypt.compareSync(password, user.password)) return getErrorRes(res);

  return res.json({
    status: 200,
    message: 'success',
    data: {
      token: jwt.sign({ account: lowerCaseAccount }, process.env.JWT_SECRET!),
      user: {
        account: user.account,
        team: user.team,
        name: user.name,
      },
    },
  });
}

async function registerUser(account: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());
  const newUser = new User({
    account,
    password: hashedPassword,
  });
  await newUser.save();
  return newUser;
}

async function registerFunc(req: Request, res: Response) {
  const { account, password } = req.body;
  const lowerCaseAccount = account.toLowerCase();

  const user = await User.findOne({ account: lowerCaseAccount });
  if (user) return getErrorRes(res);

  await registerUser(lowerCaseAccount, password);
  const token = jwt.sign({ account: lowerCaseAccount }, process.env.JWT_SECRET!);

  return res.json({
    status: 200,
    message: 'success',
    data: {
      token: token,
      user: {
        account: lowerCaseAccount,
      },
    },
  });
}

async function authGoogle(req: Request, res: Response) {
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    const lowerCaseAccount = payload?.email?.toLowerCase();
    if (!lowerCaseAccount) return new Error('email not found!!');

    let user = await User.findOne({ account: lowerCaseAccount });
    let token = '';
    if (user) {
      token = jwt.sign({ account: lowerCaseAccount }, process.env.JWT_SECRET!);
    } else {
      user = await registerUser(lowerCaseAccount, 'DefaultedGooglePassword');
      token = jwt.sign({ account: lowerCaseAccount }, process.env.JWT_SECRET!);
    }
    return res.json({
      status: 200,
      message: 'success',
      data: {
        token: token,
        user: {
          account: user.account,
          team: user.team,
          name: user.name,
        },
      },
    });
  }
  verify().catch(console.error);
}

async function logoutFunc(req: Request, res: Response) {
  req.logout(error => {
    if (error) return getErrorRes(res);

    return res.json({
      status: 200,
      message: 'success',
    });
  });
}

const userController = {
  login: loginFunc,
  register: registerFunc,
  authGoogle: authGoogle,
  logout: logoutFunc,
};

export default userController;
