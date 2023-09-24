import type { Request, Response } from 'express';
import { Product } from '@/models/product';

const productController = {
  getProducts(_req: Request, res: Response) {
    Product.find({})
      .exec()
      .then(products => {
        return res.json({
          status: 200,
          message: 'success',
          data: {
            products,
          },
        });
      })
      .catch(error => res.status(400).json({ status: 400, message: error.message }));
  },
};

export default productController;
