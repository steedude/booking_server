import express from 'express';
// import passport from '@/config/passport';
import productController from '@/controllers/admin/productController';

const router = express.Router();

router.get('/product', productController.read);
router.post('/product', productController.create);
router.delete('/product/:product_id', productController.delete);
router.put('/product/:product_id', productController.update);
router.post('/uploadImages', productController.uploadImages);

export default router;
