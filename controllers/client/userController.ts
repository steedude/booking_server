import type { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@/models/user';

async function loginFunc(req: Request, res: Response) {
  const { account, password } = req.body;

  if (!account || !password) {
    return res.json({
      status: 400,
      message: 'Please enter account and password!!',
    });
  }

  const user = await User.findOne({ account });
  if (!user) {
    return res.json({
      status: 400,
      message: 'Unregister account!!',
    });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.json({
      status: 400,
      message: 'Incorrect password!!',
    });
  }

  return res.json({
    status: 200,
    message: 'success',
    data: {
      token: jwt.sign({ id: user.id }, process.env.JWT_SECRET!),
      user: {
        account: user.account,
        team: user.team,
        name: user.name,
      },
    },
  });
}

async function registerFunc(req: Request, res: Response) {
  const { account, password } = req.body;

  const user = await User.findOne({ account });
  if (user) {
    return res.json({
      status: 400,
      message: 'account Exist!!',
    });
  }

  const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());
  const newUser = new User({
    account,
    password: hashedPassword,
  });
  await newUser.save();

  const token = jwt.sign({ account: account }, process.env.JWT_SECRET!);
  return res.json({
    status: 200,
    message: 'success',
    data: {
      token: token,
      user: {
        account: account,
      },
    },
  });
}

async function logoutFunc(req: Request, res: Response) {
  req.logout(error => {
    if (error) {
      return res.json({
        status: 400,
        message: 'error',
      });
    }
    return res.json({
      status: 200,
      message: 'success',
    });
  });
}

const userController = {
  login: loginFunc,
  register: registerFunc,
  logout: logoutFunc,
};

export default userController;
