import { Router } from "express";
import { verifyTokenClient } from "../controllers/AuthController";
import * as saleOrderController from "../controllers/SaleOrderController";
const router = Router();

router.get("/api/v1/SaleOrder", verifyTokenClient, saleOrderController.get);
router.get(
  "/api/v1/SaleOrder/:id",
  verifyTokenClient,
  saleOrderController.getById
);
router.post(
  "/api/v1/SaleOrder/Full",
  verifyTokenClient,
  saleOrderController.postWithFull
);
router.post("/api/v1/SaleOrder", verifyTokenClient, saleOrderController.post);
router.put("/api/v1/SaleOrder", verifyTokenClient, saleOrderController.put);
router.delete(
  "/api/v1/SaleOrder/:id",
  verifyTokenClient,
  saleOrderController.deleteById
);
router.get(
  "/api/v1/SaleOrder/:id",
  verifyTokenClient,
  saleOrderController.getById
);
router.post("/api/v1/SaleOrder", verifyTokenClient, saleOrderController.post);
router.put("/api/v1/SaleOrder", verifyTokenClient, saleOrderController.put);
router.delete(
  "/api/v1/SaleOrder/:id",
  verifyTokenClient,
  saleOrderController.deleteById
);
router.get(
  "/api/v1/SaleOrder/User/:customerId",
  verifyTokenClient,
  saleOrderController.getByUserId
);
router.get(
  "/api/v1/DeleteSaleOrder/:id",
  verifyTokenClient,
  saleOrderController.deleteSaleOrder
);
router.get(
  "/api/v1/UnDeleteSaleOrder/:id",
  verifyTokenClient,
  saleOrderController.unDeleteSaleOrder
);
router.put(
  "/api/v1/updateSaleOrder/:id",
  verifyTokenClient,
  saleOrderController.updateSaleOrder
);

export default router;
