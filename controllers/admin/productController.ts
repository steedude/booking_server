import type { Request, Response } from 'express';
import { Product } from '../../models/product';
import multer from 'multer';
import fs from 'fs';
import { Queue, Worker } from 'bullmq';
import type { QueueOptions } from 'bullmq';

/**
 * Setting Redis port for queue options
 */
const opts: QueueOptions = {
  connection: {
    host: 'localhost',
    port: 6379,
  },
};

/**
 * Job-queue ins
 */
const removeImageQueue = new Queue('remove-image', opts);

/**
 * Job-worker ins
 */
const worker = new Worker(
  'remove-image',
  async job => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.unlink(`./${job.data.url}`, err => {
        if (err) reject(err);
        resolve('ok');
      });
    });
  },
  opts,
);

/**
 * Job-worker event listeners
 */
worker.on('completed', job => {
  console.log(`remove file: ${job.data.url} has completed!`);
});
worker.on('failed', (job, err) => {
  // TODO 把錯誤訊息寫到 logger 未來可改善流程
  console.log(`remove file: ${job?.data.url} has failed with ${err.message}`);
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'images');
  },
});
const upload = multer({
  fileFilter(_, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload an image'));
    }
    cb(null, true);
  },
  limits: {
    // 限制上傳檔案的大小為 10MB
    fileSize: 10000000,
  },
  storage,
});

const productController = {
  async create(req: Request, res: Response) {
    const { name, seats, image, description, projector, television, is_confirmed: isConfirmed, window } = req.body;
    try {
      await Product.create({
        name,
        seats,
        image,
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
    const { name, seats, image, description, projector, television, is_confirmed: isConfirmed, window } = req.body;
    try {
      const searchData = await Product.findById(req.params.product_id);
      if (searchData === null) {
        return res.status(400).json({ status: '400', message: '查無此id' });
      }
      const difference = searchData.image.filter((x: string) => !image.includes(x));

      difference.map(async url => {
        console.log('difference - url', url);
        await removeImageQueue.add(`remove-image:${url}`, { url });
      });

      await Product.updateOne(
        { _id: req.params.product_id },
        {
          name,
          seats,
          image,
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
  },

  async uploadImages(req: Request, res: Response) {
    upload.array('images', 5)(req, res, async err => {
      if (err) {
        return res.status(400).json({ message: '檔案上傳失敗' });
      }
      if (!req.files) {
        return res.status(400).json({ message: '找不到req.file' });
      }
      const imagePaths: Array<string> = [];
      if (Array.isArray(req.files)) {
        req.files.forEach(item => imagePaths.push(item.path));
      }
      return res.status(200).json({
        status: '200',
        message: 'success',
        data: {
          images: imagePaths,
        },
      });
    });
  },
};

export default productController;
