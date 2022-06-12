import { Router } from "express";
import * as systemUserController from "../controllers/SystemUserController";
import * as authController from "../controllers/AuthController";
const router = Router();

router.get(
  "/api/v1/AdminManage/GetSystemUsers",
  authController.verifyTokenAdmin,
  systemUserController.getSystemUsers
);

router.get(
  "/api/v1/GetSystemUserById/:id",
  systemUserController.getSystemUserById
);

router.post("/api/v1/RegisterClient", authController.registerClient);

router.post("/api/v1/LoginClient", authController.loginClient);

router.post("/api/v1/RegisterAdmin", authController.registerAdmin);

router.post("/api/v1/LoginAdmin", authController.loginAdmin);

router.put(
  "/api/v1/AdminManage/UpdateSystemUser/:id",
  authController.verifyTokenAdmin,
  systemUserController.updateSystemUser
);

router.put(
  "/api/v1/UpdateAccountClient",
  authController.verifyTokenClient,
  systemUserController.updateAccountClient
);

router.post(
  "/api/v1/AdminManage/CreateAdmin",
  authController.verifyTokenAdmin,
  systemUserController.createAdmin
);

router.get(
  "/api/v1/AdminManage/DeleteSystemUser/:id",
  authController.verifyTokenAdmin,
  systemUserController.deleteSystemUser
);

router.get(
  "/api/v1/AdminManage/UnDeleteSystemUser/:id",
  authController.verifyTokenAdmin,
  systemUserController.unDeleteSystemUser
);

// Don't use api "/api/v1/DeleteForeverSystemUser/:id" because it can destroy the structure of the system.
router.get(
  "/api/v1/AdminManage/DeleteForeverSystemUser/:id",
  authController.verifyTokenAdmin,
  systemUserController.deleteForeverSystemUser
);

router.get("/api/v1/LogoutAccount", authController.logoutAccount);

router.get("/api/v1/Verify", authController.verifyTokenAdmin);

export default router;
