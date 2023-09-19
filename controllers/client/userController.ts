import type { Request, Response } from 'express';

const userController = {
  login(_: Request, res: Response) {
    return res.json({
      status: 'success',
      message: 'saved successfully',
    });
  },
};

export default userController;
