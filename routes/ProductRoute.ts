import { Router } from "express";
import { verifyTokenClient } from "../controllers/AuthController";
import * as productController from "../controllers/ProductController";
const router = Router();

router.get("/api/v1/Product", productController.get);
router.get("/api/v1/Product/:id", productController.getById);
router.post("/api/v1/Product", verifyTokenClient, productController.post);
router.put("/api/v1/Product", verifyTokenClient, productController.put);
router.delete(
  "/api/v1/Product/:id",
  verifyTokenClient,
  productController.deleteById
);
router.get("/api/v1/Product/Store/:storeId", productController.getByStoreId);
router.get(
  "/api/v1/DeleteProduct/:id",
  verifyTokenClient,
  productController.deleteProduct
);
router.get(
  "/api/v1/UnDeleteProduct/:id",
  verifyTokenClient,
  productController.unDeleteProduct
);
router.put(
  "/api/v1/UpdateProduct/:id",
  verifyTokenClient,
  productController.updateProduct
);

export default router;
