import { Router } from "express";
import { verifyTokenClient } from "../controllers/AuthController";
import * as saleOrderDetailController from "../controllers/SaleOrderDetailController";
const router = Router();

router.get(
  "/api/v1/SaleOrderDetail",
  verifyTokenClient,
  saleOrderDetailController.get
);
router.get(
  "/api/v1/SaleOrderDetail/:id",
  verifyTokenClient,
  saleOrderDetailController.getById
);
router.post(
  "/api/v1/SaleOrderDetail",
  verifyTokenClient,
  saleOrderDetailController.post
);
router.put(
  "/api/v1/SaleOrderDetail",
  verifyTokenClient,
  saleOrderDetailController.put
);
router.delete(
  "/api/v1/SaleOrderDetail/:id",
  verifyTokenClient,
  saleOrderDetailController.deleteById
);
router.get(
  "/api/v1/SaleOrderDetail/SaleOrder/:saleOrderId",
  verifyTokenClient,
  saleOrderDetailController.getBySaleOrderId
);

export default router;
