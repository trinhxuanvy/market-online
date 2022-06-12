import { Router } from 'express';
import * as saleOrderController from '../controllers/SaleOrderController';
const router = Router();

router.get('/api/v1/SaleOrder', saleOrderController.get);
router.get('/api/v1/SaleOrder/:id', saleOrderController.getById);
router.post('/api/v1/SaleOrder', saleOrderController.post);
router.put('/api/v1/SaleOrder', saleOrderController.put);
router.delete('/api/v1/SaleOrder/:id', saleOrderController.deleteById);
router.get(
  '/api/v1/SaleOrder/User/:customerId',
  saleOrderController.getByUserId,
);

export default router;
