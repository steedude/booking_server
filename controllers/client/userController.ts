import type { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { IUser } from '@/models/user';

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

function getErrorRes(res: Response) {
  return res.status(400).json({
    status: 400,
    message: 'authorization failed',
  });
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
  loginSuccess(req: Request, res: Response) {
    return getLoginSuccessRes(res, req.user as IUser);
  },
  registerSuccess(req: Request, res: Response) {
    return getLoginSuccessRes(res, req.user as IUser);
  },
  authGoogleSuccess(req: Request, res: Response) {
    return getLoginSuccessRes(res, req.user as IUser);
  },
  logout: logoutFunc,
};

export default userController;
