import type { Request, Response } from 'express';
import { Product } from '../../models/product';
import multer from 'multer';

const upload = multer({
  fileFilter(_, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload an image'));
    }
    cb(null, true);
  },
});
const productController = {
  async create(req: Request, res: Response) {
    upload.array('image', 3)(req, res, async err => {
      if (err) {
        return res.status(400).json({ message: '檔案上傳失敗' });
      }
      if (!req.files) {
        return res.status(400).json({ message: '找不到req.file' });
      }
      const buffers: Array<Buffer> = [];
      if (Array.isArray(req.files)) {
        req.files.forEach(item => buffers.push(item.buffer));
      }
      const { name, seats, description, projector, television, is_confirmed: isConfirmed, window } = req.body;
      try {
        await Product.create({
          name,
          seats,
          image: buffers,
          description,
          projector,
          television,
          is_confirmed: isConfirmed,
          window,
        });
        return res.status(200).json({ status: '200', message: 'success' });
      } catch (e) {
        return res.status(400).json({ status: '400', message: e });
      }
    });
  },
  async delete(req: Request, res: Response) {
    try {
      await Product.deleteOne({ _id: req.params.product_id });
      return res.json({ status: '200', message: 'success' });
    } catch (e) {
      return res.status(400).json({ status: '400', message: e });
    }
  },
  async read(_: Request, res: Response) {
    try {
      const documents = await Product.find({});
      return res.json({ status: '200', message: 'success', data: { products: documents } });
    } catch (e) {
      return res.status(400).json({ status: '400', message: e });
    }
  },
  async update(req: Request, res: Response) {
    upload.array('image', 3)(req, res, async err => {
      if (err) {
        return res.status(400).json({ status: '400', message: '檔案上傳失敗' });
      }
      if (!req.files) {
        return res.status(400).json({ status: '400', message: '找不到req.file' });
      }
      const buffers: Array<Buffer> = [];
      if (Array.isArray(req.files)) {
        req.files.forEach(item => buffers.push(item.buffer));
      }
      console.log(buffers);
      const { name, seats, description, projector, television, is_confirmed: isConfirmed, window } = req.body;
      try {
        await Product.updateOne(
          { _id: req.params.product_id },
          {
            name,
            seats,
            image: buffers,
            description,
            projector,
            television,
            is_confirmed: isConfirmed,
            window,
          },
        );
        return res.status(200).json({ status: '200', message: 'success' });
      } catch (e) {
        return res.status(400).json({ status: '400', message: e });
      }
    });
  },
};

export default productController;
