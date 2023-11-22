import type { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser } from '@/models/user';
import { Team } from '@/models/team';

async function getUserInfo(user: IUser) {
  return {
    account: user.account,
    team: (await Team.findById(user.team_id))?.name,
    name: user.name,
    image: user.image,
  };
}

async function getLoginSuccessRes(res: Response, user: IUser) {
  return res.json({
    status: 200,
    message: 'success',
    data: {
      token: jwt.sign({ id: user.id }, process.env.JWT_SECRET!),
      user: await getUserInfo(user),
    },
  });
}

function getErrorRes(res: Response) {
  return res.status(400).json({
    status: 400,
    message: 'authorization failed',
  });
}

async function changePasswordFunc(req: Request, res: Response) {
  const newPassword = req.body.password;
  const user = req.user as unknown as IUser;
  const userModel = await User.findById(user.id);
  if (!userModel) return res.status(400).json({ status: 400, message: '查無此user' });
  const hashedPassword = await bcrypt.hash(newPassword, bcrypt.genSaltSync());
  user.password = hashedPassword;
  await userModel.updateOne({ password: user.password });
  return res.json({ status: 200, message: 'success' });
}

async function setUserInfoFunc(req: Request, res: Response) {
  const name = req.body.name;
  const teamId = req.body.team_id;
  const user = req.user as unknown as IUser;
  const userModel = await User.findById(user.id);
  if (!userModel) return res.status(400).json({ status: 400, message: '查無此user' });
  try {
    if (teamId && user.team_id !== teamId) {
      const teamModel = await Team.findById(teamId);
      if (!teamModel) return res.status(400).json({ status: '400', message: '查無此team' });
      user.team_id = teamModel.id;
      await userModel.updateOne({ team_id: user.team_id });
    }
    if (name && user.name !== name) {
      user.name = name;
      await userModel.updateOne({ name: user.name });
    }
    return res.json({
      status: 200,
      message: 'success',
      data: {
        user: await getUserInfo(user),
      },
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error });
  }
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

async function getUser(req: Request, res: Response) {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ status: 200, message: 'no token' });
    }
    const decoded = (await jwt.verify(token, process.env.JWT_SECRET!)) as { id: string };
    const searchResult = await User.findById(decoded.id);
    return res.json({
      status: 200,
      message: 'success',
      data: {
        token: token,
        user: {
          account: searchResult?.account,
          team: searchResult?.team_id || null,
          name: searchResult?.name,
          image: searchResult?.image || null,
        },
      },
    });
  } catch (err) {
    return res.json({
      status: 400,
      message: err,
    });
  }
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
  getUser: getUser,
  changePassword: changePasswordFunc,
  setUserInfo: setUserInfoFunc,
  logout: logoutFunc,
};

export default userController;
