import { Router } from 'express';
import * as productController from '../controllers/ProductController';
const router = Router();

router.get('/api/v1/Product', productController.get);
router.get('/api/v1/Product/:id', productController.getById);
router.post('/api/v1/Product', productController.post);
router.put('/api/v1/Product', productController.put);
router.delete('/api/v1/Product/:id', productController.deleteById);
router.get('/api/v1/Product/Store/:storeId', productController.getByStoreId);

export default router;
