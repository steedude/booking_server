import express from 'express';
// import passport from '@/config/passport';
import productController from '@/controllers/client/productController';

const router = express.Router();

router.get('/products', productController.getProducts);

export default router;
