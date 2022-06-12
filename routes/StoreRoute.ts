import { Router } from "express";
import { verifyTokenClient } from "../controllers/AuthController";
import * as storeController from "../controllers/StoreController";
const router = Router();

router.get("/api/v1/Store", storeController.get);
router.get("/api/v1/Store/:id", storeController.getById);
router.post("/api/v1/Store", verifyTokenClient, storeController.post);
router.put("/api/v1/Store", verifyTokenClient, storeController.put);
router.delete(
  "/api/v1/Store/:id",
  verifyTokenClient,
  storeController.deleteById
);
router.get(
  "/api/v1/Store/User/:userId",
  verifyTokenClient,
  storeController.getByUserId
);

router.get(
  "/api/v1/DeleteStore/:id",
  verifyTokenClient,
  storeController.deleteStore
);

router.put(
  "/api/v1/UnDeleteStore/:id",
  verifyTokenClient,
  storeController.unDeleteStore
);

router.put(
  "/api/v1/UpdateStore/:id",
  verifyTokenClient,
  storeController.updateStore
);
export default router;
