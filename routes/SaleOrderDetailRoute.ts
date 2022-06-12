import { Router } from 'express';
import * as saleOrderDetailController from '../controllers/SaleOrderDetailController';
const router = Router();

router.get('/api/v1/SaleOrderDetail/:id', saleOrderDetailController.getById);
router.post('/api/v1/SaleOrderDetail', saleOrderDetailController.post);
router.put('/api/v1/SaleOrderDetail', saleOrderDetailController.put);
router.delete(
  '/api/v1/SaleOrderDetail/:id',
  saleOrderDetailController.deleteById,
);
router.get(
  '/api/v1/SaleOrderDetail/SaleOrder/:saleOrderId',
  saleOrderDetailController.getBySaleOrderId,
);

export default router;
