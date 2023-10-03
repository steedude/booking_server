import type { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser } from '@/models/user';
import { OAuth2Client } from 'google-auth-library';

function getErrorRes(res: Response) {
  return res.status(400).json({
    status: 400,
    message: 'authorization failed',
  });
}

function getLoginSuccessRes(res: Response, user: IUser) {
  return res.json({
    status: 200,
    message: 'success',
    data: {
      token: jwt.sign({ id: user.id }, process.env.JWT_SECRET!),
      user: {
        account: user.account,
        team: user.team_id,
        name: user.name,
      },
    },
  });
}

async function loginSuccessFunc(req: Request, res: Response) {
  const user = req.user as IUser;
  return getLoginSuccessRes(res, user);
}

async function registerUser(account: string, password: string, name: string | undefined = undefined) {
  const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());
  const newUser = new User({
    account,
    password: hashedPassword,
    name: name || account,
  });
  await newUser.save();
  return newUser;
}

async function registerFunc(req: Request, res: Response) {
  const { account, password } = req.body;
  const lowerCaseAccount = account.toLowerCase();

  let user = await User.findOne({ account: lowerCaseAccount });
  if (user) return getErrorRes(res);

  user = await registerUser(lowerCaseAccount, password);
  return getLoginSuccessRes(res, user);
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
    if (!user) user = await registerUser(lowerCaseAccount, process.env.DEFAULT_GOOGLE_PASSWORD!, payload?.name);
    return getLoginSuccessRes(res, user);
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
  loginSuccess: loginSuccessFunc,
  register: registerFunc,
  authGoogle: authGoogle,
  logout: logoutFunc,
};

export default userController;
