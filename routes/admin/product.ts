import express from 'express';
import passport from '@/config/passport';
import productController from '@/controllers/admin/productController';

const router = express.Router();
const authenticated = passport.authenticate('AdminJwt', { session: false });

router.get('/products', authenticated, productController.read);
router.post('/product', authenticated, productController.create);
router.delete('/product/:product_id', authenticated, productController.delete);
router.put('/product/:product_id', authenticated, productController.update);
router.post('/uploadImages', productController.uploadImages);

export default router;
