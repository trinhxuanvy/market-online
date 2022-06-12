import { Router } from "express";
import * as systemUserController from "../controllers/SystemUserController";
import * as authController from "../controllers/AuthController";
const router = Router();

router.get("/api/v1/GetSystemUsers", systemUserController.getSystemUsers);

router.get(
  "/api/v1/GetSystemUserById/:id",
  systemUserController.getSystemUserById
);

router.post("/api/v1/RegisterClient", authController.registerClient);

router.post("/api/v1/LoginClient", authController.loginClient);

router.post("/api/v1/RegisterAdmin", authController.registerAdmin);

router.post("/api/v1/LoginAdmin", authController.loginAdmin);

router.put("/api/v1/UpdateAdmin", systemUserController.updateSystemUser);

router.post("/api/v1/CreateAdmin", systemUserController.createSystemUser);

export default router;
