// import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

const userController = {
  login(_: Request, res: Response) {
    return res.json({
      status: 'success',
      message: 'saved successfully',
    });
  },

  postAuthGoogle(req: Request, res: Response) {
    console.log(req.body);

    const client = new OAuth2Client();
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: req.body.credential,
        // Specify the CLIENT_ID of the app that accesses the backend
        audience: '368476803835-c1fvfk2n1psur8hfjm5bh1n42a05pr2d.apps.googleusercontent.com',
      });
      const payload = ticket.getPayload();
      console.log(payload);
    }
    verify().catch(console.error);

    return res.json({
      status: 'success',
      message: 'saved successfully',
    });
  },
};

export default userController;
